package project.web.backend.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.web.backend.dtos.request.event.EventRequestDTO;
import project.web.backend.dtos.response.ApiSuccessResponse;
import project.web.backend.dtos.response.event.EventCreateRequestResponseDTO;
import project.web.backend.services.EventCreateRequestService;

@RestController
@RequestMapping("/api/event-request")
@Validated
@RequiredArgsConstructor
public class EventCreateRequestController {
    private final EventCreateRequestService eventCreateRequestService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole({'MANAGER'})")
    public ApiSuccessResponse<EventCreateRequestResponseDTO> createEventRequest(
            @Valid @RequestBody EventRequestDTO eventRequestDTO
    ) {
        return ApiSuccessResponse.<EventCreateRequestResponseDTO>builder()
                .data(eventCreateRequestService.createEventRequest(eventRequestDTO))
                .message("Created!")
                .status(HttpStatus.OK.value())
                .build();
    }
}
