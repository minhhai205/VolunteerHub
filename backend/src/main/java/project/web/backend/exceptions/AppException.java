package project.web.backend.exceptions;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import project.web.backend.utils.enums.ErrorCode;

@Getter
public class AppException extends RuntimeException{
    private final ErrorCode errorCode;

    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
