package project.web.backend.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import lombok.RequiredArgsConstructor;
import project.web.backend.services.ExportService;
import project.web.backend.utils.commons.ExportResult;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor

@Validated
public class AdminController {

    private final ExportService exportService;

    @GetMapping("/event/{id}/members/export")
    public ResponseEntity<StreamingResponseBody> exportFile(@RequestParam String format, @PathVariable Long id) {
        ExportResult result = exportService.exportEventMembers(id, format);
        StreamingResponseBody body = out -> {
            out.write(result.getBytes());
            out.flush();
        };
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + result.getFilename())
            .contentType(result.getMediaType())
            .body(body);
    }

    @GetMapping("/events/export")
    public ResponseEntity<StreamingResponseBody> exportAllEvents(@RequestParam String format) {
        ExportResult result = exportService.exportAllEvents(format);
        StreamingResponseBody body = out -> {
            out.write(result.getBytes());
            out.flush();
        };
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + result.getFilename())
            .contentType(result.getMediaType())
            .body(body);
    }
}
