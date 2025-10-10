package project.web.backend.services;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import project.web.backend.dtos.request.EventRequestDTO;
import project.web.backend.dtos.response.EventResponseDTO;
import project.web.backend.entities.Category;
import project.web.backend.entities.Event;
import project.web.backend.entities.User;
import project.web.backend.exceptions.AppException;
import project.web.backend.mappers.EventMapper;
import project.web.backend.repositories.CategoryRepository;
import project.web.backend.repositories.EventRepository;
import project.web.backend.repositories.UserRepository;
import project.web.backend.utils.commons.SecurityUtil;
import project.web.backend.utils.enums.ErrorCode;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public EventResponseDTO createEvent(EventRequestDTO eventRequestDTO) {
        log.info("------------ Create new event --------------");

        Set<Category> categories = categoryRepository.findByNameIn(eventRequestDTO.getCategoryNames());

        Event newEvent = eventMapper.toEntity(eventRequestDTO);
        newEvent.setCategories(categories);

        String email = SecurityUtil.getCurrentEmail();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        newEvent.setManager(currentUser);

        eventRepository.save(newEvent);

        return eventMapper.toResponseDTO(newEvent);
    }
}
