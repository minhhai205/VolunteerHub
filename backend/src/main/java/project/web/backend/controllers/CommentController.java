package project.web.backend.controllers;


import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import project.web.backend.dtos.request.comment.CommentRequestDTO;
import project.web.backend.dtos.response.ApiSuccessResponse;
import project.web.backend.dtos.response.PageResponseDTO;
import project.web.backend.dtos.response.comment.CommentResponseDTO;
import project.web.backend.services.CommentService;

import java.util.List;

@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {
    private final CommentService commentService;
    
    @GetMapping("/comment-list/{postId}")
    @PreAuthorize("!hasRole('ADMIN')")
    public ApiSuccessResponse<PageResponseDTO<List<CommentResponseDTO>>> getAllComments(
            Pageable pageable,
            @PathVariable @Min(value = 0, message = "Post id must be greater than 0") Long postId
    ) {
        return ApiSuccessResponse.<PageResponseDTO<List<CommentResponseDTO>>>builder()
                .data(commentService.getAllCommentsByPost(pageable, postId))
                .status(HttpStatus.OK.value())
                .message("Get all comments successfully!")
                .build();
    }

    @PostMapping("/create-comment")
    @PreAuthorize("!hasRole('ADMIN')")
    public ApiSuccessResponse<CommentResponseDTO> createComment(
            @RequestBody @Valid CommentRequestDTO dto
    ) {
        return ApiSuccessResponse.<CommentResponseDTO>builder()
                .data(commentService.create(dto))
                .status(HttpStatus.OK.value())
                .message("Create comment successfully")
                .build();
    }
}
