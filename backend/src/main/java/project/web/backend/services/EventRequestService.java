package project.web.backend.services;

import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.web.backend.dtos.request.event.EventRequestDTO;
import project.web.backend.dtos.response.event.EventRequestResponseDTO;
import project.web.backend.entities.Category;
import project.web.backend.entities.EventCreateRequest;
import project.web.backend.entities.User;
import project.web.backend.exceptions.AppException;
import project.web.backend.mappers.EventRequestMapper;
import project.web.backend.repositories.*;
import project.web.backend.utils.commons.SecurityUtil;
import project.web.backend.utils.enums.ErrorCode;
import project.web.backend.utils.enums.EventRequestStatus;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventRequestService {
    private final EventRequestRepository eventRequestRepository;
    private final EventRequestMapper eventRequestMapper;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public EventRequestResponseDTO createEventRequest(EventRequestDTO eventRequestDTO) {
        log.info("------------ Create new event request --------------");

        Set<Category> categories = categoryRepository.findByNameIn(eventRequestDTO.getCategoryNames());

        EventCreateRequest newRequest = eventRequestMapper.toEntity(eventRequestDTO);
        newRequest.setStatus(EventRequestStatus.PENDING);
        newRequest.setCategories(categories);

        String email = SecurityUtil.getCurrentEmail();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        newRequest.setManager(currentUser);

        eventRequestRepository.save(newRequest);

        return eventRequestMapper.toResponseDTO(newRequest);
    }

    @Transactional
    public EventRequestResponseDTO approveEventRequest(Long requestId) {
        log.info("------------ Approve event request --------------");

        EventCreateRequest request = eventRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_EXISTED));

        if(request.getStatus() != EventRequestStatus.PENDING) {
            throw new AppException(ErrorCode.REQUEST_INVALID);
        }

        request.setStatus(EventRequestStatus.APPROVED);

        eventRequestRepository.save(request);

        // send web push to manager

        return eventRequestMapper.toResponseDTO(request);
    }

    @Transactional
    public EventRequestResponseDTO rejectEventRequest(Long requestId) {
        log.info("------------ Reject event request --------------");

        EventCreateRequest request = eventRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_EXISTED));

        if(request.getStatus() != EventRequestStatus.PENDING) {
            throw new AppException(ErrorCode.REQUEST_INVALID);
        }

        request.setStatus(EventRequestStatus.REJECTED);

        eventRequestRepository.save(request);

        // send web push to manager

        return eventRequestMapper.toResponseDTO(request);
    }
}
