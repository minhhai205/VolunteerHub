package project.web.backend.controllers;


import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import project.web.backend.dtos.request.post.CreatePostRequestDTO;
import project.web.backend.dtos.request.post.UpdatePostRequestDTO;
import project.web.backend.dtos.response.ApiSuccessResponse;
import project.web.backend.dtos.response.PageResponseDTO;
import project.web.backend.dtos.response.post.PostBasicResponseDTO;
import project.web.backend.dtos.response.post.PostResponseDTO;
import project.web.backend.services.PostService;

import java.util.List;


@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
@Validated
public class PostController {
    private final PostService postService;

    @PostMapping("/create-post")
    @PreAuthorize("hasRole('USER') OR hasRole('MANAGER')")
    public ApiSuccessResponse<PostBasicResponseDTO> createPost(
            @RequestBody @Valid CreatePostRequestDTO dto
    ) {
        return ApiSuccessResponse.<PostBasicResponseDTO>builder()
                .data(postService.create(dto))
                .status(HttpStatus.OK.value())
                .message("Created post")
                .build();
    }

    @GetMapping("/post-list/{eventId}")
    @PreAuthorize("hasRole('USER') OR hasRole('MANAGER')")
    public ApiSuccessResponse<PageResponseDTO<List<PostResponseDTO>>> getPosts(
            Pageable pageable,
            @PathVariable @Min(value = 1, message = "Event id must be greater than 0") Long eventId
    ) {
        return ApiSuccessResponse.<PageResponseDTO<List<PostResponseDTO>>>builder()
                .data(postService.getPosts(pageable, eventId))
                .status(HttpStatus.OK.value())
                .message("Get all posts successfully")
                .build();
    }

    @PatchMapping("/update-post/{postId}")
    @PreAuthorize("hasRole('USER') OR hasRole('MANAGER')")
    public ApiSuccessResponse<PostBasicResponseDTO> updatePost(
            @PathVariable @Min(value = 1, message = "post id must be greater than 0") Long postId,
            @RequestBody @Valid UpdatePostRequestDTO dto
    ) {
        return ApiSuccessResponse.<PostBasicResponseDTO>builder()
                .data(postService.updatePost(postId, dto))
                .status(HttpStatus.OK.value())
                .message("Update post successfully")
                .build();
    }

    @PostMapping("/reaction/{postId}")
    @PreAuthorize("hasRole('USER') OR hasRole('MANAGER')")
    public ApiSuccessResponse<String> handlePostReaction(
            @PathVariable @Min(value = 1, message = "Post id must be greater than 0") long postId
    ) {
        return ApiSuccessResponse.<String>builder()
                .data(postService.handlePostReaction(postId))
                .status(HttpStatus.OK.value())
                .message("Reaction post successfully")
                .build();
    }


    @GetMapping("/trending-posts")
    public ApiSuccessResponse<List<PostResponseDTO>> getPostsTrending() {
        return ApiSuccessResponse.<List<PostResponseDTO>>builder()
                .data(postService.getTrendingPosts())
                .status(HttpStatus.OK.value())
                .message("Get all posts trending successfully")
                .build();
    }


    @GetMapping("/newest-posts")
    public ApiSuccessResponse<List<PostResponseDTO>> getPostsNewest() {
        return ApiSuccessResponse.<List<PostResponseDTO>>builder()
                .data(postService.getNewestPosts())
                .status(HttpStatus.OK.value())
                .message("Get all newest posts successfully")
                .build();
    }
}
