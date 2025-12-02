package project.web.backend.services;

import com.sun.jdi.request.EventRequest;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.web.backend.dtos.request.event.EventRequestDTO;
import project.web.backend.dtos.request.notification.NotificationPayload;
import project.web.backend.dtos.response.PageResponseDTO;
import project.web.backend.dtos.response.event.EventRegistrationResponseDTO;
import project.web.backend.dtos.response.event.EventRequestResponseDTO;
import project.web.backend.dtos.response.event.RegistrationStatusResponseDTO;
import project.web.backend.entities.*;
import project.web.backend.exceptions.AppException;
import project.web.backend.mappers.EventMapper;
import project.web.backend.mappers.EventRequestMapper;
import project.web.backend.repositories.*;
import project.web.backend.utils.commons.SecurityUtil;
import project.web.backend.utils.enums.ErrorCode;
import project.web.backend.utils.enums.EventRequestStatus;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventRequestService {
    private final EventRegistrationRepository eventRegistrationRepository;
    private final EventRequestRepository eventRequestRepository;
    private final EventRequestMapper eventRequestMapper;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;
    private final PushNotificationService pushNotificationService;
    private final EventMemberRepository eventMemberRepository;

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

        // Send notification
        NotificationPayload payload = NotificationPayload.builder()
                .title("Yêu cầu tạo event!")
                .body(String.format("%s đã gửi yêu cầu tạo event mới!", currentUser.getFullName()))
                .url("http://localhost:3000/event/list")
                .build();

        List<User> admins = userRepository.findAllAdmin();
        List<Long> adminIds = admins.stream().map(User::getId).toList();
        pushNotificationService.sendNotificationToAll(payload, adminIds);

        return eventRequestMapper.toResponseDTO(newRequest);
    }

    public PageResponseDTO<List<EventRequestResponseDTO>> getAllEventRequest(Pageable pageable) {
        log.info("------------ Get all events request --------------");

        Page<EventCreateRequest> eventRequests = eventRequestRepository.findAllPagination(pageable);

        List<Long> eventRequestIds = eventRequests.stream().map(EventCreateRequest::getId).toList();

        List<EventCreateRequest> fetchedEvents = eventRequestRepository.findByIdsWithCategories(eventRequestIds);
        Map<Long, EventCreateRequest> idEventMap = fetchedEvents.stream()
                .collect(Collectors.toMap(EventCreateRequest::getId, e -> e));

        List<EventRequestResponseDTO> dtos = eventRequestIds.stream()
                .map(idEventMap::get)
                .map(eventRequestMapper::toResponseDTO)
                .toList();

        return PageResponseDTO.<List<EventRequestResponseDTO>>builder()
                .totalPage(eventRequests.getTotalPages())
                .pageNo(pageable.getPageNumber())
                .pageSize(pageable.getPageSize())
                .data(dtos)
                .build();
    }

    public List<EventRequestResponseDTO> getAllPendingEventRequest() {
        log.info("------------ Get all pending events request --------------");

        List<EventCreateRequest> eventRequests = eventRequestRepository
                .findByStatusIn(List.of(EventRequestStatus.PENDING));

        return eventRequests.stream()
                .map(eventRequestMapper::toResponseDTO).toList();
    }

    public List<EventRequestResponseDTO> getAllProcessedEventRequest() {
        log.info("------------ Get all processed events request --------------");

        List<EventCreateRequest> eventRequests = eventRequestRepository
                .findByStatusIn(List.of(EventRequestStatus.APPROVED, EventRequestStatus.REJECTED));

        return eventRequests.stream()
                .map(eventRequestMapper::toResponseDTO).toList();
    }

    @Transactional
    public EventRequestResponseDTO approveEventRequest(Long requestId) {
        log.info("------------ Approve event request --------------");

        EventCreateRequest request = eventRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_EXISTED));

        if (request.getStatus() != EventRequestStatus.PENDING) {
            throw new AppException(ErrorCode.REQUEST_INVALID);
        }

        request.setStatus(EventRequestStatus.APPROVED);
        eventRequestRepository.save(request);

        // Create new event
        Event newEvent = Event.builder()
                .name(request.getName())
                .description(request.getDescription())
                .location(request.getLocation())
                .imageUrl(request.getImageUrl())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .categories(new HashSet<>(request.getCategories()))
                .manager(request.getManager())
                .build();
        eventRepository.save(newEvent);

        // send web push to manager
        // ....

        return eventRequestMapper.toResponseDTO(request);
    }

    @Transactional
    public EventRequestResponseDTO rejectEventRequest(Long requestId) {
        log.info("------------ Reject event request --------------");

        EventCreateRequest request = eventRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_EXISTED));

        if (request.getStatus() != EventRequestStatus.PENDING) {
            throw new AppException(ErrorCode.REQUEST_INVALID);
        }

        request.setStatus(EventRequestStatus.REJECTED);

        eventRequestRepository.save(request);

        // send web push to manager

        return eventRequestMapper.toResponseDTO(request);
    }

    public PageResponseDTO<List<EventRegistrationResponseDTO>> getAllRegistration(Pageable pageable, EventRequestStatus status) {
        Page<EventRegistration> registrations = eventRegistrationRepository.getAll(pageable, status);
        List<EventRegistrationResponseDTO> dtos = registrations.stream()
                .map(eventRequestMapper::toEventRegistrationResponseDTO)
                .toList();
        return PageResponseDTO.<List<EventRegistrationResponseDTO>>builder()
                .data(dtos)
                .totalPage(registrations.getTotalPages())
                .pageNo(pageable.getPageNumber())
                .pageSize(pageable.getPageSize())
                .total(registrations.getTotalElements())
                .build();
    }

    public PageResponseDTO<List<EventRegistrationResponseDTO>> getAllMyRegistration(Pageable pageable) {
        String email = SecurityUtil.getCurrentEmail();
        Page<EventRegistration> registrations = eventRegistrationRepository.getMyUserRegistration(pageable, email);
        List<EventRegistrationResponseDTO> dtos = registrations.stream().map(eventRequestMapper::toEventRegistrationResponseDTO)
                .toList();
        return PageResponseDTO.<List<EventRegistrationResponseDTO>>builder()
                .data(dtos)
                .totalPage(registrations.getTotalPages())
                .pageNo(pageable.getPageNumber())
                .pageSize(pageable.getPageSize())
                .build();
    }


    @Transactional
    public EventRegistrationResponseDTO approveRegistration(Long requestId) {
        EventRegistration eventRegistration = eventRegistrationRepository.findByIdWithUserAndEvent(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_EXISTED));
        if (eventRegistration.getStatus() != EventRequestStatus.PENDING) {
            throw new AppException(ErrorCode.REQUEST_INVALID);
        }
        eventRegistration.setStatus(EventRequestStatus.APPROVED);
        eventRegistrationRepository.save(eventRegistration);
        // after update status, add user to event, create EventMember
        Event event = eventRegistration.getEvent();
        User user = eventRegistration.getUser();
        EventMember eventMember = EventMember.builder()
                .event(event)
                .user(user)
                .build();
        eventMemberRepository.save(eventMember);
        // send push approve to user
        return eventRequestMapper.toEventRegistrationResponseDTO(eventRegistration);
    }


    @Transactional
    public EventRegistrationResponseDTO rejectRegistration(Long requestId) {
        EventRegistration eventRegistration = eventRegistrationRepository.findByIdWithUserAndEvent(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_EXISTED));
        if (eventRegistration.getStatus() != EventRequestStatus.PENDING) {
            throw new AppException(ErrorCode.REQUEST_INVALID);
        }
        eventRegistration.setStatus(EventRequestStatus.REJECTED);
        eventRegistrationRepository.save(eventRegistration);
        // send push reject to user
        return eventRequestMapper.toEventRegistrationResponseDTO(eventRegistration);
    }

    public RegistrationStatusResponseDTO getRegistrationStatus(Long eventId) {
        log.info("----------- Get registration status for event {} ------------", eventId);

        RegistrationStatusResponseDTO response = RegistrationStatusResponseDTO.builder()
                .status("NOT_REGISTERED")
                .build();

        String email = SecurityUtil.getCurrentEmail();
        Optional<EventRegistration> eventRegistration = eventRegistrationRepository
                .findByEventIdAndUserEmail(eventId, email);

        eventRegistration.ifPresent(registration ->
                response.setStatus(registration.getStatus().name()));

        return response;
    }

    @Transactional
    public String cancelMyRegistrationRequest(Long eventId) {
        log.info("----------- Cancel registration request for event {} ------------", eventId);

        String email = SecurityUtil.getCurrentEmail();
        EventRegistration eventRegistration = eventRegistrationRepository.findByEventIdAndUserEmail(eventId, email)
                .orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_EXISTED));

        if (eventRegistration.getStatus() != EventRequestStatus.PENDING) {
            throw new AppException(ErrorCode.REQUEST_INVALID);
        }

        eventRegistrationRepository.delete(eventRegistration);

        return "OK";
    }


}
