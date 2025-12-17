package project.web.backend.controllers;


import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import project.web.backend.dtos.request.event.EventRequestDTO;
import project.web.backend.dtos.request.user.EventMemberFilterRequestDTO;
import project.web.backend.dtos.request.user.WorkRatingRequestDTO;
import project.web.backend.dtos.response.ApiSuccessResponse;
import project.web.backend.dtos.response.PageResponseDTO;
import project.web.backend.dtos.response.event.EventNameResponseDTO;
import project.web.backend.dtos.response.event.EventResponseDTO;
import project.web.backend.dtos.response.user.EventMemberResponseDTO;
import project.web.backend.services.EventService;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/event")
@Validated
@RequiredArgsConstructor
@Tag(name = "event controller")
public class EventController {
    private final EventService eventService;

    @GetMapping("/event-list")
    public ApiSuccessResponse<PageResponseDTO<List<EventResponseDTO>>> getAllEvents(
            Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer status
    ) {
        return ApiSuccessResponse.<PageResponseDTO<List<EventResponseDTO>>>builder()
                .data(eventService.getAllEvents(pageable, search, categoryId, status))
                .status(HttpStatus.OK.value())
                .message("Get all events successfully!")
                .build();
    }

    @GetMapping("/suggestions")
    public ApiSuccessResponse<Set<String>> getSuggestions(@RequestParam String search) {
        return ApiSuccessResponse.<Set<String>>builder()
                .data(eventService.getSuggestions(search))
                .status(HttpStatus.OK.value())
                .message("Get suggestions successfully!")
                .build();
    }

    @GetMapping("/manager/my-event")
    @PreAuthorize("hasRole('MANAGER')")
    public ApiSuccessResponse<PageResponseDTO<List<EventResponseDTO>>> getManagerMyEvent(
            Pageable pageable,
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "0") Integer status
    ) {
        return ApiSuccessResponse.<PageResponseDTO<List<EventResponseDTO>>>builder()
                .data(eventService.getManagerMyEvent(pageable, search, status))
                .status(HttpStatus.OK.value())
                .message("Get all events successfully!")
                .build();
    }


    @GetMapping("/manager/my-event-name")
    @PreAuthorize("hasRole('MANAGER')")
    public ApiSuccessResponse<List<EventNameResponseDTO>> getManagerMyEventName() {
        return ApiSuccessResponse.<List<EventNameResponseDTO>>builder()
                .data(eventService.getManagerMyEventName())
                .status(HttpStatus.OK.value())
                .message("Get all events successfully!")
                .build();
    }


    @GetMapping("/my-event")
    @PreAuthorize("hasRole('USER')")
    public ApiSuccessResponse<List<EventResponseDTO>> getUserMyEvent() {
        return ApiSuccessResponse.<List<EventResponseDTO>>builder()
                .data(eventService.getMyEvent())
                .status(HttpStatus.OK.value())
                .message("Get all events successfully!")
                .build();
    }

    @GetMapping("/manager/newest")
    public ApiSuccessResponse<List<EventResponseDTO>> getNewestPublishedEventsByManager() {
        return ApiSuccessResponse.<List<EventResponseDTO>>builder()
                .data(eventService.getNewestPublishedEventsByManager())
                .status(HttpStatus.OK.value())
                .message("Get newest events successfully!")
                .build();
    }

    @GetMapping("/newest")
    public ApiSuccessResponse<List<EventResponseDTO>> getNewestPublishedEvents() {
        return ApiSuccessResponse.<List<EventResponseDTO>>builder()
                .data(eventService.getNewestPublishedEvents())
                .status(HttpStatus.OK.value())
                .message("Get newest events successfully!")
                .build();
    }

    @GetMapping("/manager/trending")
    public ApiSuccessResponse<List<EventResponseDTO>> getTrendingEventsByManager() {
        return ApiSuccessResponse.<List<EventResponseDTO>>builder()
                .data(eventService.getTrendingEventsByManager())
                .status(HttpStatus.OK.value())
                .message("Get trending events successfully!")
                .build();
    }

    @GetMapping("/trending")
    public ApiSuccessResponse<List<EventResponseDTO>> getTrendingEvents() {
        return ApiSuccessResponse.<List<EventResponseDTO>>builder()
                .data(eventService.getTrendingEvents())
                .status(HttpStatus.OK.value())
                .message("Get trending events successfully!")
                .build();
    }

    @PostMapping("/registration/{eventId}")
    @PreAuthorize("hasRole('USER')")
    public ApiSuccessResponse<String> eventRegistration(
            @PathVariable Long eventId
    ) {
        return ApiSuccessResponse.<String>builder()
                .data(eventService.eventRegistration(eventId))
                .status(HttpStatus.OK.value())
                .message("Register event successfully!")
                .build();
    }

    /**
     * Get event details by event id
     *
     * @param eventId the event id using regex to validate
     * @return EventResponseDTO
     */
    @GetMapping("/{eventId:[\\d]+}")
    public ApiSuccessResponse<EventResponseDTO> getEventDetails(
            @PathVariable @Min(value = 1, message = "Event id must be greater than 0") Long eventId
    ) {
        return ApiSuccessResponse.<EventResponseDTO>builder()
                .data(eventService.getEventDetails(eventId))
                .status(HttpStatus.OK.value())
                .message("Get event details successfully!")
                .build();
    }

    @PatchMapping("/update/{eventId}")
    @PreAuthorize("hasRole('MANAGER')")
    public ApiSuccessResponse<EventResponseDTO> updateEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody EventRequestDTO eventRequestDTO
    ) {
        return ApiSuccessResponse.<EventResponseDTO>builder()
                .data(eventService.updateEvent(eventId, eventRequestDTO))
                .status(HttpStatus.OK.value())
                .message("Update event successfully!")
                .build();
    }

    @PatchMapping("/leave/{eventId}")
    @PreAuthorize("hasAnyRole({'USER'})")
    public ApiSuccessResponse<String> leaveMyEvent(
            @PathVariable @Min(value = 1, message = "Request id must be greater than 0") Long eventId
    ) {
        return ApiSuccessResponse.<String>builder()
                .data(eventService.leaveMyEvent(eventId))
                .message("Leaved!")
                .status(HttpStatus.OK.value())
                .build();
    }

    @GetMapping("/event-members")
    @PreAuthorize("hasAnyRole({'MANAGER'})")
    public ApiSuccessResponse<PageResponseDTO<List<EventMemberResponseDTO>>> getEventMembers(
            Pageable pageable,
            @ModelAttribute @Valid EventMemberFilterRequestDTO dto
    ) {
        return ApiSuccessResponse.<PageResponseDTO<List<EventMemberResponseDTO>>>builder()
                .data(eventService.getEventMembers(dto, pageable))
                .message("Get event members")
                .status(HttpStatus.OK.value())
                .build();
    }


    @PatchMapping("/work-rating")
    @PreAuthorize("hasAnyRole({'MANAGER'})")
    public ApiSuccessResponse<String> workRating(
            @RequestBody @Valid WorkRatingRequestDTO dto
    ) {
        return ApiSuccessResponse.<String>builder()
                .data(eventService.rating(dto))
                .message("Rated members")
                .status(HttpStatus.OK.value())
                .build();
    }


    @DeleteMapping("/delete-event/{eventId}")
    @PreAuthorize("hasAnyRole({'MANAGER'})")
    public ApiSuccessResponse<String> deleteEvent(
            @PathVariable @Min(value = 1, message = "Event id must be greater than 0") Long eventId
    ) {
        return ApiSuccessResponse.<String>builder()
                .data(eventService.deleteEvent(eventId))
                .message("Rated members")
                .status(HttpStatus.OK.value())
                .build();
    }
}
