package project.web.backend.services;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import project.web.backend.dtos.request.event.EventRequestDTO;
import project.web.backend.dtos.response.event.EventResponseDTO;
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

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

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

    public List<EventResponseDTO> getAllEvents() {
        log.info("------------ Get all events --------------");

        List<Event> events = eventRepository.findAllWithCategories();
        List<EventResponseDTO> eventResponses = events.stream().map(eventMapper::toResponseDTO).toList();

        List<Long> eventsIds = events.stream().map(Event::getId).toList();

        Map<Long, Long> memberCountMap = eventRepository.findCountMemberForEvents(eventsIds).stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (Long) row[1]
                ));

        Map<Long, Long> postCountMap = eventRepository.findCountPostForEvents(eventsIds).stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (Long) row[1]
                ));

        eventResponses.forEach(eventResponse -> {
            eventResponse.setCountMembers(memberCountMap.get(eventResponse.getId()));
            eventResponse.setCountPosts(postCountMap.get(eventResponse.getId()));
        });

        return eventResponses;
    }
}
