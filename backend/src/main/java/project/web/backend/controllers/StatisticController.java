package project.web.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.web.backend.dtos.response.ApiSuccessResponse;
import project.web.backend.dtos.response.statistic.AdminStatisticsResponseDTO;
import project.web.backend.dtos.response.statistic.EventStatisticDTO;
import project.web.backend.dtos.response.statistic.ManagerStatisticsResponseDTO;
import project.web.backend.services.StatisticService;

import java.util.concurrent.ExecutionException;

@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
public class StatisticController {
    private final StatisticService statisticService;

    @GetMapping("/manager/statistics")
    @PreAuthorize("hasAnyRole('MANAGER')")
    public ApiSuccessResponse<ManagerStatisticsResponseDTO> getManagerDashboardStatistics() throws ExecutionException, InterruptedException {
        return ApiSuccessResponse.<ManagerStatisticsResponseDTO>builder()
                .data(statisticService.getManagerDashboardStatistics())
                .status(HttpStatus.OK.value())
                .message("Get manager dashboard statistics successfully")
                .build();
    }

    @GetMapping("/admin/statistics")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ApiSuccessResponse<AdminStatisticsResponseDTO> getAdminDashboardStatistics() throws ExecutionException, InterruptedException {
        return ApiSuccessResponse.<AdminStatisticsResponseDTO>builder()
                .data(statisticService.getAdminDashboardStatistics())
                .status(HttpStatus.OK.value())
                .message("Get admin dashboard statistics successfully")
                .build();
    }

    @GetMapping("/admin/event/statistics")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ApiSuccessResponse<EventStatisticDTO> getEventRequestStatistics() throws ExecutionException, InterruptedException {
        return ApiSuccessResponse.<EventStatisticDTO>builder()
                .data(statisticService.getEventRequestStatistics())
                .status(HttpStatus.OK.value())
                .message("Get statistics successfully")
                .build();
    }
}
