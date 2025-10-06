package project.web.backend.exceptions;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import project.web.backend.utils.enums.ErrorCode;
@RequiredArgsConstructor
@Getter
public class AppException extends RuntimeException{
    private final ErrorCode errorCode;
}
