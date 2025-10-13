package project.web.backend.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import project.web.backend.dtos.request.event.EventRequestDTO;
import project.web.backend.dtos.response.event.EventCreateRequestResponseDTO;
import project.web.backend.entities.Category;
import project.web.backend.entities.EventCreateRequest;
import project.web.backend.entities.User;
import project.web.backend.exceptions.AppException;
import project.web.backend.mappers.EventCreateRequestMapper;
import project.web.backend.mappers.EventMapper;
import project.web.backend.repositories.*;
import project.web.backend.utils.commons.SecurityUtil;
import project.web.backend.utils.enums.ErrorCode;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventCreateRequestService {
    private final EventCreateRequestRepository eventCreateRequestRepository;
    private final EventCreateRequestMapper eventCreateRequestMapper;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public EventCreateRequestResponseDTO createEventRequest(EventRequestDTO eventRequestDTO) {
        log.info("------------ Create new event request --------------");

        Set<Category> categories = categoryRepository.findByNameIn(eventRequestDTO.getCategoryNames());

        EventCreateRequest newRequest = eventCreateRequestMapper.toEntity(eventRequestDTO);

        newRequest.setCategories(categories);

        String email = SecurityUtil.getCurrentEmail();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        newRequest.setManager(currentUser);

        eventCreateRequestRepository.save(newRequest);

        return eventCreateRequestMapper.toResponseDTO(newRequest);
    }
}
