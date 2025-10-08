package project.web.backend.utils.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public enum UserStatus {
    @JsonProperty("active")
    ACTIVE,
    @JsonProperty("locked")
    LOCKED,
    UNKNOWN;

    @JsonCreator
    public static UserStatus from(String value) {
        if (value == null) return UNKNOWN;
        try {
            return UserStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return UNKNOWN;
        }
    }
}
