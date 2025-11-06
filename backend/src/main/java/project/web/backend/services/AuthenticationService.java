package project.web.backend.services;


import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.web.backend.dtos.request.auth.LoginRequestDTO;
import project.web.backend.dtos.request.auth.LogoutRequestDTO;
import project.web.backend.dtos.request.auth.RefreshRequestDTO;
import project.web.backend.dtos.request.auth.RegisterRequestDTO;
import project.web.backend.dtos.response.auth.JwtResponseDTO;
import project.web.backend.dtos.response.user.UserResponseDTO;
import project.web.backend.entities.Role;
import project.web.backend.entities.Token;
import project.web.backend.entities.User;
import project.web.backend.exceptions.AppException;
import project.web.backend.mappers.UserMapper;
import project.web.backend.repositories.RoleRepository;
import project.web.backend.repositories.TokenRepository;
import project.web.backend.repositories.UserRepository;
import project.web.backend.utils.enums.ErrorCode;
import project.web.backend.utils.enums.TokenType;
import project.web.backend.utils.enums.UserStatus;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final TokenRepository tokenRepository;

    public JwtResponseDTO login(LoginRequestDTO dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_INVALID);
        }

        // if locked, throw 401
        if (user.getStatus().equals(UserStatus.LOCKED)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // gen token
        String accessToken = jwtService.generateToken(user, TokenType.ACCESS);
        String refreshToken = jwtService.generateToken(user, TokenType.REFRESH);

        // save token to enabled DB
        Token access = Token.builder()
                .jti(jwtService.extractJti(accessToken))
                .email(email)
                .build();
        Token refresh = Token.builder()
                .jti(jwtService.extractJti(refreshToken))
                .email(email)
                .build();
        tokenRepository.saveAll(List.of(access, refresh));

        return JwtResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public UserResponseDTO register(RegisterRequestDTO dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();
        String phoneNumber = dto.getPhoneNumber();
        String fullName = dto.getFullName();
        var wrapper = userRepository.findByEmailWithNoReferences(email);
        if (wrapper.isPresent()) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
        User user = User.builder()
                .status(UserStatus.ACTIVE)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(userRole)//default role is USER
                .fullName(fullName)
                .phoneNumber(phoneNumber)
                .build();
        userRepository.save(user);
        return userMapper.toDTO(user);
    }

    public JwtResponseDTO refresh(RefreshRequestDTO dto) {
        String refreshToken = dto.getRefreshToken();
        // check valid
        jwtService.checkValid(refreshToken, TokenType.REFRESH);
        String email = jwtService.extractEmail(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
        String accessToken = jwtService.generateToken(user, TokenType.ACCESS);
        String newRefreshToken = jwtService.generateToken(user, TokenType.REFRESH);

        Token access = Token.builder()
                .jti(jwtService.extractJti(accessToken))
                .email(email)
                .build();
        Token refresh = Token.builder()
                .jti(jwtService.extractJti(refreshToken))
                .email(email)
                .build();
        tokenRepository.saveAll(List.of(access, refresh));

        return JwtResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    @Transactional
    public String logout(LogoutRequestDTO dto) {
        String accessToken = dto.getAccessToken();
        String refreshToken = dto.getRefreshToken();

        // check valid
        jwtService.checkValid(accessToken, TokenType.ACCESS);
        jwtService.checkValid(refreshToken, TokenType.REFRESH);

        // delete from DB
        String accessJti = jwtService.extractJti(accessToken);
        String refreshJti = jwtService.extractJti(refreshToken);

        tokenRepository.deleteAllById(List.of(accessJti, refreshJti));
        return "heh";
    }
}
