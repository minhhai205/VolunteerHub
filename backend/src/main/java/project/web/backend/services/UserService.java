package project.web.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.web.backend.dtos.request.user.LockRequestDTO;
import project.web.backend.dtos.request.user.UpdateInformationRequestDTO;
import project.web.backend.dtos.response.PageResponseDTO;
import project.web.backend.dtos.response.user.UserDetailResponseDTO;
import project.web.backend.dtos.response.user.UserResponseDTO;
import project.web.backend.entities.User;
import project.web.backend.exceptions.AppException;
import project.web.backend.mappers.UserMapper;
import project.web.backend.repositories.UserRepository;
import project.web.backend.utils.commons.SecurityUtil;
import project.web.backend.utils.enums.ErrorCode;
import project.web.backend.utils.enums.UserStatus;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public PageResponseDTO<List<UserDetailResponseDTO>> getAllUsers(Pageable pageable, String role) {
        Page<User> users;
        if (role == null || role.isBlank()) {
            users = userRepository.getAllUsersAndManagers(pageable);
        } else {
            // normalize role value (expecting values like "USER", "MANAGER", "ADMIN")
            String normalizedRole = role.trim().toUpperCase();
            users = userRepository.findAllByRoleName(normalizedRole, pageable);
        }

        return PageResponseDTO.<List<UserDetailResponseDTO>>builder()
                .pageNo(pageable.getPageNumber())
                .pageSize(pageable.getPageSize())
                .totalPage(users.getTotalPages())
                .data(users.stream()
                        .map(userMapper::toDetailDTO)
                        .toList())
                .build();
    }

    @Transactional
    public UserResponseDTO updateInformation(UpdateInformationRequestDTO dto) {
        String email = SecurityUtil.getCurrentEmail();
        User user = userRepository.findByEmailWithNoReferences(email)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setFullName(dto.getFullName());
        return userMapper.toDTO(userRepository.save(user));
    }

    @Transactional
    public String lockUser(Long id, LockRequestDTO dto) {
        User user = userRepository.findByIdWithRole(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));

        // admin can't lock other admin
        if (user.getRole().getName().equals("ADMIN")) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }
        user.setStatus((dto.getLock()) ? UserStatus.LOCKED : UserStatus.ACTIVE);
        userRepository.save(user);
        return "Update lock status successfully";
    }
}
