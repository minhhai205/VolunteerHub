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
import project.web.backend.dtos.response.ApiSuccessResponse;
import project.web.backend.dtos.response.PageResponseDTO;
import project.web.backend.dtos.response.event.EventRegistrationResponseDTO;
import project.web.backend.dtos.response.event.EventRequestResponseDTO;
import project.web.backend.dtos.response.event.EventResponseDTO;
import project.web.backend.dtos.response.event.RegistrationStatusResponseDTO;
import project.web.backend.services.EventRequestService;

import java.util.List;

@RestController
@RequestMapping("/api/event-request")
@Validated
@RequiredArgsConstructor
@Tag(name = "event request controller")
public class EventRequestController {
    private final EventRequestService eventRequestService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole({'MANAGER'})")
    public ApiSuccessResponse<EventRequestResponseDTO> createEventRequest(
            @Valid @RequestBody EventRequestDTO eventRequestDTO) {
        return ApiSuccessResponse.<EventRequestResponseDTO>builder()
                .data(eventRequestService.createEventRequest(eventRequestDTO))
                .message("Created!")
                .status(HttpStatus.OK.value())
                .build();
    }

    @GetMapping("/request-list")
    public ApiSuccessResponse<PageResponseDTO<List<EventRequestResponseDTO>>> getAllEventRequest(
            Pageable pageable
    ) {
        return ApiSuccessResponse.<PageResponseDTO<List<EventRequestResponseDTO>>>builder()
                .data(eventRequestService.getAllEventRequest(pageable))
                .status(HttpStatus.OK.value())
                .message("Get all event request successfully!")
                .build();
    }

    @PatchMapping("/approve/{requestId}")
    @PreAuthorize("hasAnyRole({'ADMIN'})")
    public ApiSuccessResponse<EventRequestResponseDTO> approveEventRequest(
            @PathVariable @Min(value = 1, message = "Request id must be greater than 0") Long requestId) {
        return ApiSuccessResponse.<EventRequestResponseDTO>builder()
                .data(eventRequestService.approveEventRequest(requestId))
                .message("Approved!")
                .status(HttpStatus.OK.value())
                .build();
    }

    @PatchMapping("/reject/{requestId}")
    @PreAuthorize("hasAnyRole({'ADMIN'})")
    public ApiSuccessResponse<EventRequestResponseDTO> rejectEventRequest(
            @PathVariable @Min(value = 1, message = "Request id must be greater than 0") Long requestId) {
        return ApiSuccessResponse.<EventRequestResponseDTO>builder()
                .data(eventRequestService.rejectEventRequest(requestId))
                .message("Rejected!")
                .status(HttpStatus.OK.value())
                .build();
    }

    @GetMapping("/registration-list")
    @PreAuthorize("hasRole('MANAGER')")
    public ApiSuccessResponse<PageResponseDTO<List<EventRegistrationResponseDTO>>> allRegistrationRequest(
            Pageable pageable) {
        return ApiSuccessResponse.<PageResponseDTO<List<EventRegistrationResponseDTO>>>builder()
                .data(eventRequestService.getAllRegistration(pageable))
                .message("Get all registrations successfully")
                .status(HttpStatus.OK.value())
                .build();
    }

    @GetMapping("/pending-list")
    public ApiSuccessResponse<List<EventRequestResponseDTO>> getAllPendingEventRequest() {
        return ApiSuccessResponse.<List<EventRequestResponseDTO>>builder()
                .data(eventRequestService.getAllPendingEventRequest())
                .status(HttpStatus.OK.value())
                .message("Get all pending event requests successfully!")
                .build();
    }

    @GetMapping("/processed-list")
    public ApiSuccessResponse<List<EventRequestResponseDTO>> getAllProcessedEventRequest() {
        return ApiSuccessResponse.<List<EventRequestResponseDTO>>builder()
                .data(eventRequestService.getAllProcessedEventRequest())
                .status(HttpStatus.OK.value())
                .message("Get all processed event requests successfully!")
                .build();
    }


    @GetMapping("/my-registration")
    @PreAuthorize("hasRole('USER')")
    public ApiSuccessResponse<PageResponseDTO<List<EventRegistrationResponseDTO>>> allMyRegistrations(
            Pageable pageable
    ) {
        return ApiSuccessResponse.<PageResponseDTO<List<EventRegistrationResponseDTO>>>builder()
                .data(eventRequestService.getAllMyRegistration(pageable))
                .message("Get my registrations successfully")
                .status(HttpStatus.OK.value())
                .build();
    }


    @PatchMapping("/registration/approve/{requestId}")
    @PreAuthorize("hasAnyRole({'MANAGER'})")
    public ApiSuccessResponse<EventRegistrationResponseDTO> approveRegistrationRequest(
            @PathVariable @Min(value = 1, message = "Request id must be greater than 0") Long requestId
    ) {
        return ApiSuccessResponse.<EventRegistrationResponseDTO>builder()
                .data(eventRequestService.approveRegistration(requestId))
                .message("Approved!")
                .status(HttpStatus.OK.value())
                .build();
    }


    @PatchMapping("/registration/reject/{requestId}")
    @PreAuthorize("hasAnyRole({'MANAGER'})")
    public ApiSuccessResponse<EventRegistrationResponseDTO> rejectRegistrationRequest(
            @PathVariable @Min(value = 1, message = "Request id must be greater than 0") Long requestId
    ) {
        return ApiSuccessResponse.<EventRegistrationResponseDTO>builder()
                .data(eventRequestService.rejectRegistration(requestId))
                .message("Reject!")
                .status(HttpStatus.OK.value())
                .build();
    }

    @GetMapping("/registration-status/{eventId}")
    @PreAuthorize("hasRole('USER')")
    public ApiSuccessResponse<RegistrationStatusResponseDTO> getRegistrationStatus(
            @PathVariable @Min(value = 1, message = "Event id must be greater than 0") Long eventId
    ) {
        return ApiSuccessResponse.<RegistrationStatusResponseDTO>builder()
                .data(eventRequestService.getRegistrationStatus(eventId))
                .message("Get successfully!")
                .status(HttpStatus.OK.value())
                .build();
    }

    @PatchMapping("/registration/cancel-registration/{eventId}")
    @PreAuthorize("hasAnyRole({'USER'})")
    public ApiSuccessResponse<String> cancelMyRegistrationRequest(
            @PathVariable @Min(value = 1, message = "Request id must be greater than 0") Long eventId
    ) {
        return ApiSuccessResponse.<String>builder()
                .data(eventRequestService.cancelMyRegistrationRequest(eventId))
                .message("Canceled!")
                .status(HttpStatus.OK.value())
                .build();
    }
}
