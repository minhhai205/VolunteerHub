package project.web.backend.controllers;


import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import project.web.backend.dtos.request.EventRequestDTO;
import project.web.backend.dtos.response.ApiSuccessResponse;
import project.web.backend.dtos.response.EventResponseDTO;
import project.web.backend.services.EventService;

import java.util.List;

@RestController
@RequestMapping("/api/event")
@Validated
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole({'MANAGER'})")
    public ApiSuccessResponse<EventResponseDTO> login(
            @Valid @RequestBody EventRequestDTO eventRequestDTO
    ) {
        return ApiSuccessResponse.<EventResponseDTO>builder()
                .data(eventService.createEvent(eventRequestDTO))
                .message("Created!")
                .status(HttpStatus.OK.value())
                .build();
    }

    @GetMapping("/event-list")
    public ApiSuccessResponse<List<EventResponseDTO>> getAllEvents() {
        return ApiSuccessResponse.<List<EventResponseDTO>>builder()
                .data(eventService.getAllEvents())
                .status(HttpStatus.OK.value())
                .message("Get all events successfully!")
                .build();
    }

}
