package project.web.backend.utils.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public enum NotificationType {
    @JsonProperty("event")
    EVENT,
    @JsonProperty("post")
    POST,
    @JsonProperty("comment")
    COMMENT,

    UNKNOWN;

    @JsonCreator
    public static NotificationType from(String value) {
        if (value == null) return UNKNOWN;
        try {
            return NotificationType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return UNKNOWN;
        }
    }
}