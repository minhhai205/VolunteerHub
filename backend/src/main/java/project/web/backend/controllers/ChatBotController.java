package project.web.backend.controllers;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.web.backend.dtos.response.ApiSuccessResponse;
import project.web.backend.services.GeminiService;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/chat")
public class ChatBotController {
    private final GeminiService geminiService;

    @PostMapping
    public ApiSuccessResponse<String> chat(@RequestBody String prompt) {
        return ApiSuccessResponse.<String>builder()
                .data(geminiService.askGemini(prompt))
                .status(HttpStatus.OK.value())
                .message("Got AI response")
                .build();
    }
}
