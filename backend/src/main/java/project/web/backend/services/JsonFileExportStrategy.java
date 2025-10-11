package project.web.backend.services;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component("JSON")
@RequiredArgsConstructor
@Slf4j
public class JsonFileExportStrategy<T> implements FileExportStrategy<T> {

    private final ObjectMapper objectMapper;

    @Override
    public File export(List<T> data) throws IOException {
        log.info("------------ Export JSON file --------------");

        if (data == null || data.isEmpty()) {
            throw new IOException("No data to export");
        }

        File file = File.createTempFile("export_", ".json");
        objectMapper.writeValue(file, data);

        log.info("Exported {} records to JSON file: {}", data.size(), file.getAbsolutePath());
        return file;
    }
}
