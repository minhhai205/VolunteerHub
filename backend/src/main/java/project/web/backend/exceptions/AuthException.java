package project.web.backend.exceptions;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.AuthenticationException;
import project.web.backend.utils.enums.ErrorCode;


@Setter
@Getter
public class AuthException extends AuthenticationException {
    private final ErrorCode errorCode;

    public AuthException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
