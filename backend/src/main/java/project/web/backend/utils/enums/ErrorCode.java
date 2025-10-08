package project.web.backend.utils.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum ErrorCode {
    UNAUTHORIZED(401, "Your credentials were invalid, please check again", HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED(403, "You're not allowed to access this action, please try later", HttpStatus.FORBIDDEN),
    REGEX_INVALID(400, "Your regex was invalid, please try on later", HttpStatus.BAD_REQUEST),
    JWT_SIGN_ERROR(400, "There was an error when sign your token, please check out your token's format", HttpStatus.BAD_REQUEST),
    TOKEN_SIGNATURE_INVALID(400, "Your token signature was invalid, please login again to get your new access token", HttpStatus.BAD_REQUEST),
    TOKEN_EXPIRED(400, "Your token was expired, please login again", HttpStatus.BAD_REQUEST),
    TOKEN_INVALID(400, "Your token type was not allowed, please try again with others", HttpStatus.BAD_REQUEST);
    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
