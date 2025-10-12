package project.web.backend.services;


import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.web.backend.dtos.request.auth.LoginRequestDTO;
import project.web.backend.dtos.request.auth.RefreshRequestDTO;
import project.web.backend.dtos.request.auth.RegisterRequestDTO;
import project.web.backend.dtos.response.auth.JwtResponseDTO;
import project.web.backend.dtos.response.user.UserResponseDTO;
import project.web.backend.entities.Role;
import project.web.backend.entities.User;
import project.web.backend.exceptions.AppException;
import project.web.backend.mappers.UserMapper;
import project.web.backend.repositories.RoleRepository;
import project.web.backend.repositories.UserRepository;
import project.web.backend.utils.enums.ErrorCode;
import project.web.backend.utils.enums.TokenType;
import project.web.backend.utils.enums.UserStatus;


@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;

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
        return JwtResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(newRefreshToken)
                .build();
    }
}
