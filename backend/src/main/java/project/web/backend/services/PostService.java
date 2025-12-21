package project.web.backend.services;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.web.backend.dtos.request.notification.NotificationPayload;
import project.web.backend.dtos.request.post.CreatePostRequestDTO;
import project.web.backend.dtos.request.post.UpdatePostRequestDTO;
import project.web.backend.dtos.response.PageResponseDTO;
import project.web.backend.dtos.response.post.PostBasicResponseDTO;
import project.web.backend.dtos.response.post.PostResponseDTO;
import project.web.backend.entities.*;
import project.web.backend.exceptions.AppException;
import project.web.backend.mappers.PostMapper;
import project.web.backend.repositories.*;
import project.web.backend.utils.commons.SecurityUtil;
import project.web.backend.utils.enums.ErrorCode;
import project.web.backend.utils.enums.NotificationType;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final EventRepository eventRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostMediaRepository postMediaRepository;
    private final PostMapper postMapper;
    private final LikeRepository likeRepository;
    private final NotificationRepository notificationRepository;
    private final PushNotificationService pushNotificationService;

    @Value("${front-end.port}")
    private String frontEndPort;

    @Transactional
    public PostBasicResponseDTO create(CreatePostRequestDTO dto) {
        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_EXISTED));
        User currentUser = userRepository.findByEmailWithNoReferences(SecurityUtil.getCurrentEmail())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
        Post post = Post.builder()
                .event(event)
                .title(dto.getTitle())
                .content(dto.getContent())
                .user(currentUser)
                .build();

        if (dto.getMedias() != null && !dto.getMedias().isEmpty()) {
            List<PostMedia> medias = new ArrayList<>();
            dto.getMedias().forEach(
                    s -> medias.add(
                            PostMedia.builder()
                                    .fileUrl(s)
                                    .post(post)
                                    .build()
                    )
            );
            post.setMedias(new HashSet<>(medias));
            postRepository.save(post);
            postMediaRepository.saveAll(medias);
        } else {
            postRepository.save(post);
        }

        // Send notification to user
        if (!Objects.equals(currentUser.getId(), event.getManager().getId())) {
            String title = "Bài viết mới!";
            String content = String.format("%s đã tạo bài viết mới trong sự kiện %s!", currentUser.getFullName(), event.getName());
            NotificationPayload payload = NotificationPayload.builder()
                    .title(title)
                    .body(content)
                    .url(frontEndPort + "/event/detail/" + event.getId())
                    .build();

            Notification notification = Notification.builder()
                    .sendTo(event.getManager())
                    .content(content)
//                    .event(event)
//                    .post(post)
                    .type(NotificationType.POST)
                    .build();
            notificationRepository.save(notification);
            pushNotificationService.sendNotificationToUser(event.getManager().getId(), payload);
        }

        return postMapper.toBasicDTO(post);
    }


    @Transactional
    public PostBasicResponseDTO updatePost(Long postId, UpdatePostRequestDTO dto) {
        String email = SecurityUtil.getCurrentEmail();
        Post post = postRepository.findByIdWithCreatedUserAndPostMedia(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

        if (!post.getUser().getEmail().equals(email)) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        if (dto.getMedias() == null || dto.getMedias().isEmpty()) {
            postRepository.save(post);
        } else {
            List<PostMedia> medias = new ArrayList<>();
            dto.getMedias().forEach(
                    s -> medias.add(
                            PostMedia.builder()
                                    .fileUrl(s)
                                    .post(post)
                                    .build()
                    )
            );
            // delete old records
            postMediaRepository.deleteAllByIds(post.getMedias().stream().map(PostMedia::getId).toList());
            post.setMedias(new HashSet<>(medias));
            postRepository.save(post);
            postMediaRepository.saveAll(medias);
        }
        return postMapper.toBasicDTO(post);
    }

    public PageResponseDTO<List<PostResponseDTO>> getPosts(Pageable pageable, Long eventId) {
        Page<Post> posts = postRepository.findAllPostsWithNoFetch(pageable, eventId);

        List<Long> postIds = posts.stream()
                .map(Post::getId).toList();
        List<Post> orderedPosts = getOrderedPosts(postIds, posts);
        List<PostResponseDTO> dtos = orderedPosts.stream().map(postMapper::toDTO).toList();

        Map<Long, Long> postIdsCommentCountMap = postRepository.findAllPostsWithCommentCountByIds(postIds)
                .stream().collect(Collectors.toMap(ar -> (Long) ar[0], ar -> (Long) ar[1]));

        Map<Long, Long> postIdsLikeCountMap = postRepository.findAllPostsWithLikeCountByIds(postIds)
                .stream().collect(Collectors.toMap(ar -> (Long) ar[0], ar -> (Long) ar[1]));

        dtos.forEach(dto -> {
            dto.setLikesCount(postIdsLikeCountMap.get(dto.getId()));
            dto.setCommentsCount(postIdsCommentCountMap.get(dto.getId()));
        });

        // Tìm xem người dùng hiện tại đã like post hay chưa
        String currentEmail = SecurityUtil.getCurrentEmail();
        if (currentEmail != null) {
            Set<Long> likedPostIds = likeRepository.findLikedPostIdsByUser(currentEmail, postIds);
            dtos.forEach(dto -> dto.setIsLiked(likedPostIds.contains(dto.getId())));
        }

        return PageResponseDTO.<List<PostResponseDTO>>builder()
                .pageNo(pageable.getPageNumber())
                .pageSize(pageable.getPageSize())
                .totalPage(posts.getTotalPages())
                .data(dtos)
                .build();
    }

    private List<Post> getOrderedPosts(List<Long> postIds, Page<Post> paginationPosts) {
        List<Post> fetchedPosts = postRepository.findAllPostsWithReferencesByIds(postIds);
        Map<Long, Post> idPostMap = fetchedPosts.stream()
                .collect(Collectors.toMap(Post::getId, p -> p));
        return postIds.stream().map(idPostMap::get).toList();
    }

    @Transactional
    public String handlePostReaction(long postId) {
        String currentUserEmail = SecurityUtil.getCurrentEmail();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

        Optional<Like> likeExisted = likeRepository.findByUserIdAndPostId(currentUser.getId(), postId);
        if (likeExisted.isPresent()) {
            likeRepository.delete(likeExisted.get());
            return "success";
        }

        Like like = Like.builder()
                .user(currentUser)
                .post(post)
                .build();
        likeRepository.save(like);

        return "success";
    }


    public List<PostResponseDTO> getTrendingPosts() {
        Page<Post> posts = postRepository.findTrendingPosts(PageRequest.of(0, 5));
        return fromPagesToOrderedDTO(posts);
    }

    public List<PostResponseDTO> getNewestPosts() {
        Page<Post> posts = postRepository.findNewestPosts(PageRequest.of(0, 5));
        return fromPagesToOrderedDTO(posts);
    }


    private List<PostResponseDTO> fromPagesToOrderedDTO(Page<Post> posts) {
        List<Long> postIds = posts.stream()
                .map(Post::getId).toList();
        List<Post> orderedPosts = getOrderedPosts(postIds, posts);
        List<PostResponseDTO> dtos = orderedPosts.stream().map(postMapper::toDTO).toList();

        Map<Long, Long> postIdsCommentCountMap = postRepository.findAllPostsWithCommentCountByIds(postIds)
                .stream().collect(Collectors.toMap(ar -> (Long) ar[0], ar -> (Long) ar[1]));

        Map<Long, Long> postIdsLikeCountMap = postRepository.findAllPostsWithLikeCountByIds(postIds)
                .stream().collect(Collectors.toMap(ar -> (Long) ar[0], ar -> (Long) ar[1]));

        dtos.forEach(dto -> {
            dto.setLikesCount(postIdsLikeCountMap.get(dto.getId()));
            dto.setCommentsCount(postIdsCommentCountMap.get(dto.getId()));
        });
        return dtos;
    }
}
