package project.web.backend.utils.commons;

import org.springframework.http.MediaType;

import lombok.*;
import project.web.backend.utils.enums.ExportFormat;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExportResult {
    String filename;
    byte[] bytes;
    MediaType mediaType;
}
