package project.web.backend.controllers;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.web.backend.dtos.request.LoginRequestDTO;
import project.web.backend.dtos.response.ApiResponse;
import project.web.backend.dtos.response.ApiSuccessResponse;
import project.web.backend.services.AuthenticationService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Validated
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ApiResponse login(@RequestBody @Valid LoginRequestDTO dto) {
        return ApiSuccessResponse.builder()
                .status(HttpStatus.OK.value())
                .message("Login successfully")
                .data(authenticationService.login(dto))
                .build();
    }
}
