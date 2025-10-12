package project.web.backend.services;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import project.web.backend.utils.commons.ExportResult;
import project.web.backend.utils.enums.ExportFormat;

@Component("JSON")
@RequiredArgsConstructor
@Slf4j
public class JsonFileExportStrategy<T> implements FileExportStrategy<T> {

    private final ObjectMapper objectMapper;

    @Override
    public ExportResult export(List<T> data, String fileName) throws IOException {
        log.info("------------ Export JSON file --------------");

        if (data == null || data.isEmpty()) {
            throw new IOException("No data to export");
        }

        return ExportResult.builder()
            .bytes(objectMapper.writeValueAsString(data).getBytes())
            .filename(fileName+".json")
            .mediaType(MediaType.APPLICATION_JSON)
            .build();
    }
}
