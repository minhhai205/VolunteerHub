package project.web.backend.controllers;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import project.web.backend.dtos.request.post.CreatePostRequestDTO;
import project.web.backend.dtos.response.ApiSuccessResponse;
import project.web.backend.dtos.response.PageResponseDTO;
import project.web.backend.dtos.response.post.PostCreateResponseDTO;
import project.web.backend.dtos.response.post.PostResponseDTO;
import project.web.backend.dtos.response.user.UserDetailResponseDTO;
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
    public ApiSuccessResponse<PostCreateResponseDTO> createPost(
            @RequestBody @Valid CreatePostRequestDTO dto
    ) {
        return ApiSuccessResponse.<PostCreateResponseDTO>builder()
                .data(postService.create(dto))
                .status(HttpStatus.OK.value())
                .message("Created post")
                .build();
    }

    @GetMapping("/post-list")
    @PreAuthorize("hasRole('USER') OR hasRole('MANAGER')")
    public ApiSuccessResponse<PageResponseDTO<List<PostResponseDTO>>> getPosts(
            Pageable pageable
    ) {
        return ApiSuccessResponse.<PageResponseDTO<List<PostResponseDTO>>>builder()
                .data(postService.getPosts(pageable))
                .status(HttpStatus.OK.value())
                .message("Get all posts successfully")
                .build();
    }
}
