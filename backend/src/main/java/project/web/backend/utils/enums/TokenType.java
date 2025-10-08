package project.web.backend.utils.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public enum TokenType {
    @JsonProperty("access")
    ACCESS,
    @JsonProperty("refresh")
    REFRESH,
    RESET,
    UNKNOWN;

    @JsonCreator
    public static TokenType from(String value) {
        if (value == null) return UNKNOWN;
        try {
            return TokenType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return UNKNOWN;
        }
    }
}
