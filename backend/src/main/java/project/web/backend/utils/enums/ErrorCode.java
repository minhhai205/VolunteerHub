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
    JWT_SIGN_ERROR(400, "There was an error when sign your token, please check out your token's format",
            HttpStatus.BAD_REQUEST),
    TOKEN_SIGNATURE_INVALID(400, "Your token signature was invalid, please login again to get your new access token",
            HttpStatus.BAD_REQUEST),
    TOKEN_DISABLED(401, "Your token is disabled", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED(401, "Your token was expired, please login again", HttpStatus.UNAUTHORIZED),
    ACCOUNT_NOT_EXIST(401, "Can't find any account with your given email, please try others", HttpStatus.UNAUTHORIZED),
    PASSWORD_INVALID(401, "Your password was invalid, please try again", HttpStatus.UNAUTHORIZED),
    TOKEN_INVALID(401, "Your token type was not allowed, please try again with others", HttpStatus.UNAUTHORIZED),
    EMAIL_EXISTED(400, "Email is existed, please choose other email and try again", HttpStatus.BAD_REQUEST),
    FILE_FORMAT_UNSUPPORTED(400, "Unsupported file format", HttpStatus.BAD_REQUEST),
    ROLE_NOT_EXISTED(400, "Role was not existed in DB server", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(400, "User not existed", HttpStatus.BAD_REQUEST),
    REQUEST_INVALID(400, "Request invalid", HttpStatus.BAD_REQUEST),
    REQUEST_NOT_EXISTED(400, "Request not existed", HttpStatus.BAD_REQUEST),
    EVENT_NOT_EXISTED(400, "Event was not existed", HttpStatus.BAD_REQUEST),
    SUBSCRIPTION_EXPIRED(400, "Subscription expired", HttpStatus.BAD_REQUEST),
    POST_NOT_EXISTED(400, "Post was not existed, please try again", HttpStatus.BAD_REQUEST),
    CURRENT_PASSWORD_DUPLICATED(400, "Your new password and your last are the same" +
            ", please choose other password for security", HttpStatus.BAD_REQUEST),
    EVENT_MEMBER_NOT_EXISTED(400, "Event member not existed", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
