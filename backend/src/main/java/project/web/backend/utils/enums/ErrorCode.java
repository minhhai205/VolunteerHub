package project.web.backend.utils.enums;


import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;


@AllArgsConstructor
@Getter
public enum ErrorCode {
    UNAUTHORIZED(401,"Your credentials were invalid, please check again", HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED(403,"You're not allowed to access this action, please try later",HttpStatus.FORBIDDEN);
    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
