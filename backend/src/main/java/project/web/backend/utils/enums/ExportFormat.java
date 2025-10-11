package project.web.backend.utils.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public enum ExportFormat {
    @JsonProperty("csv")
    CSV,
    @JsonProperty("json")
    JSON,

    UNKNOWN;

    @JsonCreator
    public static ExportFormat from(String value) {
        if (value == null) return UNKNOWN;
        try {
            return ExportFormat.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return UNKNOWN;
        }
    }
}
