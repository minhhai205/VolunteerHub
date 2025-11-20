package project.web.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.web.backend.dtos.response.ApiSuccessResponse;
import project.web.backend.dtos.response.dashboard.ManagerDashboardResponseDTO;
import project.web.backend.services.ManagerDashboardService;

import java.util.concurrent.ExecutionException;

@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
public class ManagerDashboardController {
    private final ManagerDashboardService managerDashboardService;

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ApiSuccessResponse<ManagerDashboardResponseDTO> getManagerDashboardStatistics() throws ExecutionException, InterruptedException {
        return ApiSuccessResponse.<ManagerDashboardResponseDTO>builder()
                .data(managerDashboardService.getManagerDashboardStatistics())
                .status(HttpStatus.OK.value())
                .message("Get manager dashboard statistics successfully")
                .build();
    }

}
