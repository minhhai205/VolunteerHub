package project.web.backend.controllers;


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
}
