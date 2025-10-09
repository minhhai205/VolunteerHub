package project.web.backend.configs.security.errorhandlers;


import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import project.web.backend.dtos.response.ApiErrorResponse;
import project.web.backend.exceptions.AuthException;
import project.web.backend.utils.enums.ErrorCode;

import java.io.IOException;


@Component
@Slf4j
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        log.error("-----------------------------------authentication entry point start------------------------------------");
        response.setStatus(HttpStatus.OK.value());
        response.setContentType("application/json");
        if (authException instanceof AuthException) {
            AuthException exception = (AuthException) authException;
            ApiErrorResponse apiErrorResponse = ApiErrorResponse.builder()
                    .status(exception.getErrorCode().getCode())
                    .message(exception.getErrorCode().getMessage())
                    .path(request.getRequestURI())
                    .error(exception.getErrorCode().name())
                    .build();
            ObjectMapper objectMapper = new ObjectMapper();
            // convert object to string
            response.getWriter().write(objectMapper.writeValueAsString(apiErrorResponse));
        } else {
            ApiErrorResponse apiErrorResponse = ApiErrorResponse.builder()
                    .status(ErrorCode.UNAUTHORIZED.getCode())
                    .message(authException.getMessage())
                    .path(request.getRequestURI())
                    .error(authException.getMessage())
                    .build();
            ObjectMapper objectMapper = new ObjectMapper();
            // convert object to string
            response.getWriter().write(objectMapper.writeValueAsString(apiErrorResponse));
        }
    }
}
