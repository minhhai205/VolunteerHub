package project.web.backend.services;


import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.web.backend.dtos.request.post.CreatePostRequestDTO;
import project.web.backend.dtos.request.post.UpdatePostRequestDTO;
import project.web.backend.dtos.response.PageResponseDTO;
import project.web.backend.dtos.response.post.PostBasicResponseDTO;
import project.web.backend.dtos.response.post.PostResponseDTO;
import project.web.backend.entities.Event;
import project.web.backend.entities.Post;
import project.web.backend.entities.PostMedia;
import project.web.backend.entities.User;
import project.web.backend.exceptions.AppException;
import project.web.backend.mappers.PostMapper;
import project.web.backend.repositories.EventRepository;
import project.web.backend.repositories.PostMediaRepository;
import project.web.backend.repositories.PostRepository;
import project.web.backend.repositories.UserRepository;
import project.web.backend.utils.commons.SecurityUtil;
import project.web.backend.utils.enums.ErrorCode;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final EventRepository eventRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostMediaRepository postMediaRepository;
    private final PostMapper postMapper;

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
        return postMapper.toBasicDTO(post);
    }

    public PostBasicResponseDTO updatePost(Long postId, UpdatePostRequestDTO dto) {
        User currentUser = userRepository.findByEmailWithNoReferences(SecurityUtil.getCurrentEmail())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
        Post post = postRepository.findByIdWithCreatedUserAndPostMedia(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

        if (!post.getUser().getId().equals(currentUser.getId())) {
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

    public PageResponseDTO<List<PostResponseDTO>> getPosts(Pageable pageable) {

        Page<Post> posts = postRepository.findAllPostsWithNoFetch(pageable);

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
}
