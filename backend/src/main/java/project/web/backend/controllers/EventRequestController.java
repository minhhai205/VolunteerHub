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
import project.web.backend.dtos.response.event.EventRequestResponseDTO;
import project.web.backend.services.EventRequestService;

@RestController
@RequestMapping("/api/event-request")
@Validated
@RequiredArgsConstructor
public class EventRequestController {
    private final EventRequestService eventRequestService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole({'MANAGER'})")
    public ApiSuccessResponse<EventRequestResponseDTO> createEventRequest(
            @Valid @RequestBody EventRequestDTO eventRequestDTO
    ) {
        return ApiSuccessResponse.<EventRequestResponseDTO>builder()
                .data(eventRequestService.createEventRequest(eventRequestDTO))
                .message("Created!")
                .status(HttpStatus.OK.value())
                .build();
    }

    @PatchMapping("/approve/{requestId}")
    @PreAuthorize("hasAnyRole({'ADMIN'})")
    public ApiSuccessResponse<EventRequestResponseDTO> approveEventRequest(
            @PathVariable @Min(value = 1, message = "Request id must be greater than 0") Long requestId
    ) {
        return ApiSuccessResponse.<EventRequestResponseDTO>builder()
                .data(eventRequestService.approveEventRequest(requestId))
                .message("Approved!")
                .status(HttpStatus.OK.value())
                .build();
    }

    @PatchMapping("/reject/{requestId}")
    @PreAuthorize("hasAnyRole({'ADMIN'})")
    public ApiSuccessResponse<EventRequestResponseDTO> rejectEventRequest(
            @PathVariable @Min(value = 1, message = "Request id must be greater than 0") Long requestId
    ) {
        return ApiSuccessResponse.<EventRequestResponseDTO>builder()
                .data(eventRequestService.rejectEventRequest(requestId))
                .message("Rejected!")
                .status(HttpStatus.OK.value())
                .build();
    }
}
