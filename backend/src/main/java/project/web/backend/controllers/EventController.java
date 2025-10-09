package project.web.backend.controllers;


import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.web.backend.dtos.response.ApiResponse;
import project.web.backend.dtos.response.ApiSuccessResponse;

@RestController
@RequestMapping("/api/event")
@Validated
public class EventController {
    @GetMapping("/event-list")
    public ApiResponse eventList() {
        return ApiSuccessResponse.builder()
                .status(HttpStatus.OK.value())
                .message("Login successfully")
                .data("Dep trai vai lin")
                .build();
    }
}
