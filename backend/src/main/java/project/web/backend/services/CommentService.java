package project.web.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.web.backend.dtos.request.comment.CommentRequestDTO;
import project.web.backend.dtos.request.notification.NotificationPayload;
import project.web.backend.dtos.response.PageResponseDTO;
import project.web.backend.dtos.response.comment.CommentResponseDTO;
import project.web.backend.entities.Comment;
import project.web.backend.entities.Notification;
import project.web.backend.entities.Post;
import project.web.backend.entities.User;
import project.web.backend.exceptions.AppException;
import project.web.backend.mappers.CommentMapper;
import project.web.backend.repositories.CommentRepository;
import project.web.backend.repositories.NotificationRepository;
import project.web.backend.repositories.PostRepository;
import project.web.backend.repositories.UserRepository;
import project.web.backend.utils.commons.SecurityUtil;
import project.web.backend.utils.enums.ErrorCode;
import project.web.backend.utils.enums.NotificationType;

import java.util.List;
import java.util.Objects;


@Service
@RequiredArgsConstructor
public class CommentService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    private final NotificationRepository notificationRepository;
    private final PushNotificationService pushNotificationService;

    @Value("${front-end.port}")
    private String frontEndPort;


    public CommentResponseDTO create(CommentRequestDTO dto) {
        Post post = postRepository.findById(dto.getPostId())
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));
        User createdUser = userRepository.findByEmailWithNoReferences(SecurityUtil.getCurrentEmail())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));

        Comment comment = Comment.builder()
                .content(dto.getContent())
                .user(createdUser)
                .post(post)
                .build();
        commentRepository.save(comment);

        // Send notification to user
        if (!Objects.equals(post.getEvent().getManager().getId(), createdUser.getId())) {
            String title = "Comment mới!";
            String content = String.format("%s đã tạo comment mới trong trong 1 bài đăng ở sự kiện %s!",
                    createdUser.getFullName(), post.getEvent().getName());
            NotificationPayload payload = NotificationPayload.builder()
                    .title(title)
                    .body(content)
                    .url(frontEndPort + "/event/detail/" + post.getEvent().getId())
                    .build();

            Notification notification = Notification.builder()
                    .sendTo(post.getEvent().getManager())
                    .content(content)
                    .event(post.getEvent())
                    .post(post)
                    .comment(comment)
                    .type(NotificationType.POST)
                    .build();
            notificationRepository.save(notification);
            pushNotificationService.sendNotificationToUser(post.getEvent().getManager().getId(), payload);
        }

        return commentMapper.toDTO(comment);
    }

    public PageResponseDTO<List<CommentResponseDTO>> getAllCommentsByPost(Pageable pageable, Long postId) {
        Page<Comment> comments = commentRepository.findAllCommentsByPost(pageable, postId);

        List<CommentResponseDTO> commentResponses = comments.getContent().stream()
                .map(commentMapper::toDTO)
                .toList();

        return PageResponseDTO.<List<CommentResponseDTO>>builder()
                .pageNo(pageable.getPageNumber())
                .pageSize(pageable.getPageSize())
                .totalPage(comments.getTotalPages())
                .data(commentResponses)
                .build();
    }
}
