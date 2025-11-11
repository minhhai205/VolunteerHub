package project.web.backend.controllers;


import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import project.web.backend.dtos.request.event.EventRequestDTO;
import project.web.backend.dtos.response.ApiSuccessResponse;
import project.web.backend.dtos.response.event.EventResponseDTO;
import project.web.backend.services.EventService;

import java.util.List;

@RestController
@RequestMapping("/api/event")
@Validated
@RequiredArgsConstructor
@Tag(name = "event controller")
public class EventController {
    private final EventService eventService;

    @GetMapping("/event-list")
    public ApiSuccessResponse<List<EventResponseDTO>> getAllEvents() {
        return ApiSuccessResponse.<List<EventResponseDTO>>builder()
                .data(eventService.getAllEvents())
                .status(HttpStatus.OK.value())
                .message("Get all events successfully!")
                .build();
    }

    @GetMapping("/manager/my-event")
    @PreAuthorize("hasRole('MANAGER')")
    public ApiSuccessResponse<List<EventResponseDTO>> getManagerMyEvent() {
        return ApiSuccessResponse.<List<EventResponseDTO>>builder()
                .data(eventService.getManagerMyEvent())
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
    @PreAuthorize("hasRole('MANAGER')")
    public ApiSuccessResponse<List<EventResponseDTO>> getNewestPublishedEventsByManager() {
        return ApiSuccessResponse.<List<EventResponseDTO>>builder()
                .data(eventService.getNewestPublishedEventsByManager())
                .status(HttpStatus.OK.value())
                .message("Get newest events successfully!")
                .build();
    }

    @GetMapping("/manager/trending")
    @PreAuthorize("hasRole('MANAGER')")
    public ApiSuccessResponse<List<EventResponseDTO>> getTrendingEventsByManager() {
        return ApiSuccessResponse.<List<EventResponseDTO>>builder()
                .data(eventService.getTrendingEventsByManager())
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

    @GetMapping("/{eventId}")
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
}
