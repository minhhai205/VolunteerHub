package project.web.backend.dtos.request;

import java.io.Serializable;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project.web.backend.utils.enums.ExportFormat;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExportEventMembersRequestDTO implements Serializable {

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "Export format is required")
    private ExportFormat format;
}
