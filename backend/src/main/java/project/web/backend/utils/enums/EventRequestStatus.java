package project.web.backend.utils.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public enum EventRequestStatus {
    @JsonProperty("pending")
    PENDING,
    @JsonProperty("approved")
    APPROVED,
    @JsonProperty("rejected")
    REJECTED,

    UNKNOWN;

    @JsonCreator
    public static EventRequestStatus from(String value) {
        if (value == null) return UNKNOWN;
        try {
            return EventRequestStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return UNKNOWN;
        }
    }
}
