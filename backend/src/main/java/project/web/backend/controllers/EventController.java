package project.web.backend.controllers;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import project.web.backend.dtos.request.event.EventRequestDTO;
import project.web.backend.dtos.response.ApiSuccessResponse;
import project.web.backend.dtos.response.event.EventCreateRequestResponseDTO;
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
}
