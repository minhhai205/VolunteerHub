package project.web.backend.services;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.web.backend.dtos.request.event.EventRequestDTO;
import project.web.backend.dtos.response.PageResponseDTO;
import project.web.backend.dtos.response.event.EventResponseDTO;
import project.web.backend.entities.Category;
import project.web.backend.entities.Event;
import project.web.backend.entities.EventRegistration;
import project.web.backend.entities.User;
import project.web.backend.exceptions.AppException;
import project.web.backend.mappers.EventMapper;
import project.web.backend.repositories.*;
import project.web.backend.utils.commons.SecurityUtil;
import project.web.backend.utils.enums.ErrorCode;
import project.web.backend.utils.enums.EventRequestStatus;

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
    private final UserRepository userRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final CategoryRepository categoryRepository;
    private final EventMemberRepository eventMemberRepository;

    public PageResponseDTO<List<EventResponseDTO>> getAllEvents(Pageable pageable, String search) {
        log.info("------------ Get all events --------------");

        Page<Event> events = eventRepository.findAllWithSearch(pageable, search);
        List<Long> eventsIds = events.stream()
                .map(Event::getId).toList();
        List<Event> fetchedEvents = eventRepository.findWithCategoriesByIds(eventsIds);
        Map<Long, Event> idEventMap = fetchedEvents.stream()
                .collect(Collectors.toMap(Event::getId, e -> e));

        List<EventResponseDTO> eventResponses = eventsIds.stream()
                .map(idEventMap::get)
                .map(eventMapper::toResponseDTO)
                .toList();

        findCountMemberAndPostForEvents(eventsIds, eventResponses);

        return PageResponseDTO.<List<EventResponseDTO>>builder()
                .pageSize(pageable.getPageSize())
                .pageNo(pageable.getPageNumber())
                .totalPage(events.getTotalPages())
                .data(eventResponses)
                .build();
    }

    public PageResponseDTO<List<EventResponseDTO>> getManagerMyEvent(Pageable pageable, String search, Integer status) {
        log.info("------------ Get manager events --------------");
        Page<Event> events = eventRepository.findManagerEvent(
                SecurityUtil.getCurrentEmail(), search, status, pageable);
        List<Long> eventsIds = events.stream().map(Event::getId).toList();

        List<Event> fetchedEvents = eventRepository.findWithCategoriesByIds(eventsIds);
        Map<Long, Event> idEventMap = fetchedEvents.stream()
                .collect(Collectors.toMap(Event::getId, e -> e));

        List<EventResponseDTO> eventResponses = eventsIds.stream()
                .map(idEventMap::get)
                .map(eventMapper::toResponseDTO)
                .toList();

        findCountMemberAndPostForEvents(eventsIds, eventResponses);

        return PageResponseDTO.<List<EventResponseDTO>>builder()
                .pageSize(pageable.getPageSize())
                .pageNo(pageable.getPageNumber())
                .totalPage(events.getTotalPages())
                .data(eventResponses)
                .build();
    }


    public List<EventResponseDTO> getMyEvent() {
        log.info("------------ Get my events --------------");
        List<Event> events = eventRepository.findMyEventWithCategories(
                SecurityUtil.getCurrentEmail());
        List<EventResponseDTO> eventResponses = events.stream().map(eventMapper::toResponseDTO).toList();

        List<Long> eventsIds = events.stream().map(Event::getId).toList();

        findCountMemberAndPostForEvents(eventsIds, eventResponses);

        return eventResponses;
    }

    /**
     * Get the 4 latest events for a manager.
     *
     * @return List event
     */
    public List<EventResponseDTO> getNewestPublishedEventsByManager() {
        log.info("------------ Get new est published events by manager --------------");

        String email = SecurityUtil.getCurrentEmail();
        User currentUser = userRepository.findByEmailWithNoReferences(email)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));

        // Tránh phân trang trên memory
        Pageable pageable = PageRequest.of(0, 4);
        List<Long> eventsIds = eventRepository.findNewestPublishedEventsByManager(currentUser.getId(), pageable)
                .stream().map(Event::getId).toList();

        List<Event> events = eventRepository.findEventByIdIn(eventsIds);
        List<EventResponseDTO> eventResponses = events.stream().map(eventMapper::toResponseDTO).toList();

        findCountMemberAndPostForEvents(eventsIds, eventResponses);

        return eventResponses;
    }

    /**
     * Get the 6 latest events.
     *
     * @return List event
     */
    public List<EventResponseDTO> getNewestPublishedEvents() {
        log.info("------------ Get new est published events --------------");

        Pageable pageable = PageRequest.of(0, 6);
        List<Long> eventsIds = eventRepository.findNewestPublishedEvents(pageable)
                .stream().map(Event::getId).toList();

        List<Event> events = eventRepository.findEventByIdIn(eventsIds);
        List<EventResponseDTO> eventResponses = events.stream().map(eventMapper::toResponseDTO).toList();

        findCountMemberAndPostForEvents(eventsIds, eventResponses);

        return eventResponses;
    }

    /**
     * Get top trending events for a manager( members > minMembers, limit 6)
     *
     * @return List event.
     */
    public List<EventResponseDTO> getTrendingEventsByManager() {
        log.info("------------ Get trending events by manager --------------");

        String email = SecurityUtil.getCurrentEmail();
        User currentUser = userRepository.findByEmailWithNoReferences(email)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));

        // Tránh phân trang trên memory
        Pageable pageable = PageRequest.of(0, 6);
        int minMembers = 0;
        List<Long> eventsIds = eventRepository.findTopTrendingEventsByManager(currentUser.getId(), minMembers, pageable)
                .stream().map(Event::getId).toList();

        List<Event> events = eventRepository.findEventByIdIn(eventsIds);
        List<EventResponseDTO> eventResponses = events.stream().map(eventMapper::toResponseDTO).toList();

        findCountMemberAndPostForEvents(eventsIds, eventResponses);

        return eventResponses;
    }

    /**
     * Get top trending events ( members > minMembers, limit 6)
     *
     * @return List event.
     */
    public List<EventResponseDTO> getTrendingEvents() {
        log.info("------------ Get trending events --------------");

        // Tránh phân trang trên memory
        Pageable pageable = PageRequest.of(0, 6);
        int minMembers = 0;
        List<Long> eventsIds = eventRepository.findTopTrendingEvents(minMembers, pageable)
                .stream().map(Event::getId).toList();

        List<Event> events = eventRepository.findEventByIdIn(eventsIds);
        List<EventResponseDTO> eventResponses = events.stream().map(eventMapper::toResponseDTO).toList();

        findCountMemberAndPostForEvents(eventsIds, eventResponses);

        return eventResponses;
    }

    public String eventRegistration(Long eventId) {
        log.info("------------ Event registration -------------");
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_EXISTED));

        String email = SecurityUtil.getCurrentEmail();
        User currentUser = userRepository.findByEmailWithNoReferences(email)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));

        EventRegistration eventRegistration = EventRegistration.builder()
                .user(currentUser)
                .event(event)
                .status(EventRequestStatus.PENDING)
                .build();
        eventRegistrationRepository.save(eventRegistration);

        // send web push to all managers
        return "Created registration request";
    }

    public EventResponseDTO getEventDetails(Long eventId) {
        log.info("------------ Get event details --------------");

        Event event = eventRepository.findEventById(eventId)
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_EXISTED));

        EventResponseDTO eventResponseDTO = eventMapper.toResponseDTO(event);

        List<Long> eventsIds = List.of(event.getId());
        Map<Long, Long> memberCountMap = findCountMemberForEvents(eventsIds);

        eventResponseDTO.setCountMembers(memberCountMap.get(event.getId()));

        return eventResponseDTO;
    }

    @Transactional
    public EventResponseDTO updateEvent(Long eventId, EventRequestDTO eventRequestDTO) {
        log.info("------------ Update event --------------");

        Event event = eventRepository.findEventByIdWithManager(eventId)
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_EXISTED));

        String email = SecurityUtil.getCurrentEmail();

        if (!event.getManager().getEmail().equals(email)) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        event.setName(eventRequestDTO.getName());
        event.setDescription(eventRequestDTO.getDescription());
        event.setLocation(eventRequestDTO.getLocation());
        event.setStartDate(eventRequestDTO.getStartDate());
        event.setEndDate(eventRequestDTO.getEndDate());

        Set<Category> categories = categoryRepository.findByNameIn(eventRequestDTO.getCategoryNames());
        event.setCategories(categories);

        eventRepository.save(event);

        return eventMapper.toResponseDTO(event);
    }

    @Transactional
    public String leaveMyEvent(Long eventId) {
        log.info("------------ Leave my event --------------");

        String email = SecurityUtil.getCurrentEmail();
        EventRegistration eventRegistration = eventRegistrationRepository.findByEventIdAndUserEmail(eventId, email)
                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_EXISTED));

        if (eventRegistration.getStatus() != EventRequestStatus.APPROVED) {
            throw new AppException(ErrorCode.REQUEST_INVALID);
        }

        eventRegistrationRepository.delete(eventRegistration);
        eventMemberRepository.deleteByEventIdAndUserEmail(eventId, email);

        return "OK";
    }

    private Map<Long, Long> findCountMemberForEvents(List<Long> eventsIds) {
        return eventRepository.findCountMemberForEvents(eventsIds).stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (Long) row[1]
                ));
    }

    private Map<Long, Long> findCountPostForEvents(List<Long> eventsIds) {
        return eventRepository.findCountPostForEvents(eventsIds).stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (Long) row[1]
                ));
    }

    private void findCountMemberAndPostForEvents(List<Long> eventsIds, List<EventResponseDTO> eventResponses) {
        Map<Long, Long> memberCountMap = findCountMemberForEvents(eventsIds);
        Map<Long, Long> postCountMap = findCountPostForEvents(eventsIds);

        eventResponses.forEach(eventResponse -> {
            eventResponse.setCountMembers(memberCountMap.get(eventResponse.getId()));
            eventResponse.setCountPosts(postCountMap.get(eventResponse.getId()));
        });
    }
}
