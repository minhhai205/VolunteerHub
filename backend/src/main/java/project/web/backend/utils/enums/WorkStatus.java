package project.web.backend.utils.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public enum WorkStatus {
    @JsonProperty("pending")
    PENDING,
    @JsonProperty("completed")
    COMPLETED,
    @JsonProperty("absent")
    ABSENT,
    UNKNOWN;

    @JsonCreator
    public static WorkStatus from(String value) {
        if (value == null) return UNKNOWN;
        try {
            return WorkStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return UNKNOWN;
        }
    }
}
