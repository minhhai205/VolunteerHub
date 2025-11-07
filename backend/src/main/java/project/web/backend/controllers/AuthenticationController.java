package project.web.backend.controllers;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.web.backend.dtos.request.auth.*;
import project.web.backend.dtos.response.ApiSuccessResponse;
import project.web.backend.dtos.response.auth.JwtResponseDTO;
import project.web.backend.dtos.response.user.UserResponseDTO;
import project.web.backend.services.AuthenticationService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

@Validated
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ApiSuccessResponse<JwtResponseDTO> login(@RequestBody @Valid LoginRequestDTO dto) {
        return ApiSuccessResponse.<JwtResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Login successfully")
                .data(authenticationService.login(dto))
                .build();
    }

    @PostMapping("/register")
    public ApiSuccessResponse<UserResponseDTO> register(@RequestBody @Valid RegisterRequestDTO dto) {
        return ApiSuccessResponse.<UserResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Register successfully")
                .data(authenticationService.register(dto))
                .build();
    }

    @PostMapping("/refresh")
    public ApiSuccessResponse<JwtResponseDTO> refresh(@RequestBody @Valid RefreshRequestDTO dto) {
        return ApiSuccessResponse.<JwtResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Refresh successfully")
                .data(authenticationService.refresh(dto))
                .build();
    }

    @PostMapping("/forgot-password")
    public ApiSuccessResponse<?> forgot() {
        return ApiSuccessResponse.builder()
                .status(HttpStatus.OK.value())
                .message("Forgot password successfully")
                .data(null)
                .build();
    }


    @PostMapping("/logout")
    public ApiSuccessResponse<String> logout(
            @RequestBody @Valid LogoutRequestDTO dto
    ) {
        return ApiSuccessResponse.<String>builder()
                .status(HttpStatus.OK.value())
                .message("Logout successfully")
                .data(authenticationService.logout(dto))
                .build();
    }

    @PostMapping("/change-password")
    public ApiSuccessResponse<String> changePassword(
            @RequestBody @Valid ChangePasswordRequestDTO dto
    ) {
        return ApiSuccessResponse.<String>builder()
                .status(HttpStatus.OK.value())
                .message("Change password successfully")
                .data(authenticationService.changePassword(dto))
                .build();
    }
}
