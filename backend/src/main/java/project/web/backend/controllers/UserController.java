package project.web.backend.controllers;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import project.web.backend.dtos.request.user.LockRequestDTO;
import project.web.backend.dtos.request.user.UpdateInformationRequestDTO;
import project.web.backend.dtos.response.ApiSuccessResponse;
import project.web.backend.dtos.response.PageResponseDTO;
import project.web.backend.dtos.response.user.UserDetailResponseDTO;
import project.web.backend.dtos.response.user.UserResponseDTO;
import project.web.backend.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Validated
public class UserController {
        private final UserService userService;

        // may need search param later
        /**
         * get all users api for admin site
         *
         * @param pageable pagination parameter
         * @return {@link PageResponseDTO}
         */
        @GetMapping("/user-list")
        @PreAuthorize("hasRole('ADMIN')")
        public ApiSuccessResponse<PageResponseDTO<List<UserDetailResponseDTO>>> getAllUsers(
                        Pageable pageable,
                        @RequestParam(required = false) String role) {
                return ApiSuccessResponse.<PageResponseDTO<List<UserDetailResponseDTO>>>builder()
                                .data(userService.getAllUsers(pageable, role))
                                .status(HttpStatus.OK.value())
                                .message("Get all users successfully!")
                                .build();
        }

        /**
         * update information for account
         *
         * @param dto updateInformation dto
         * @return {@link UserResponseDTO}
         */
        @PatchMapping("/update-information")
        public ApiSuccessResponse<UserResponseDTO> updateInformation(
                        @RequestBody @Valid UpdateInformationRequestDTO dto) {
                return ApiSuccessResponse.<UserResponseDTO>builder()
                                .data(userService.updateInformation(dto))
                                .status(HttpStatus.OK.value())
                                .message("Update users successfully!")
                                .build();
        }

        @PatchMapping("/lock-user/{userId}")
        @PreAuthorize("hasRole('ADMIN')")
        public ApiSuccessResponse<String> lockUser(
                        @PathVariable @Min(value = 1, message = "id must bt greater than 0") Long userId,
                        @RequestBody @Valid LockRequestDTO dto) {
                return ApiSuccessResponse.<String>builder()
                                .data(userService.lockUser(userId, dto))
                                .status(HttpStatus.OK.value())
                                .message("Update lock status user successfully!")
                                .build();
        }
}
