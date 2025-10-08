package project.web.backend.services;


import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.web.backend.dtos.request.LoginRequestDTO;
import project.web.backend.dtos.response.JwtResponseDTO;
import project.web.backend.entities.User;
import project.web.backend.exceptions.AppException;
import project.web.backend.repositories.UserRepository;
import project.web.backend.utils.enums.ErrorCode;
import project.web.backend.utils.enums.TokenType;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public JwtResponseDTO login(LoginRequestDTO dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_INVALID);
        }
        // gen token
        String accessToken = jwtService.generateToken(user, TokenType.ACCESS);
        String refreshToken = jwtService.generateToken(user, TokenType.REFRESH);
        return JwtResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}
