package project.web.backend.services;

import java.io.IOException;
import java.io.StringWriter;
import java.lang.reflect.Field;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import com.opencsv.CSVWriter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import project.web.backend.utils.commons.ExportResult;

@Component("CSV")
@RequiredArgsConstructor
@Slf4j
public class CSVFileExportStrategy<T> implements FileExportStrategy<T> {

    @Override
    public ExportResult export(List<T> data, String fileName) throws IOException {
        log.info("------------ Export CSV file --------------");

        if (data == null || data.isEmpty()) {
            throw new IOException("No data to export");
        }

        StringWriter stringWriter = new StringWriter();
        try (CSVWriter csvWriter = new CSVWriter(stringWriter)) {

            // Get field names from the first object
            Field[] fields = data.get(0).getClass().getDeclaredFields();
            String[] header = new String[fields.length];
            for (int i = 0; i < fields.length; i++) {
                header[i] = fields[i].getName();
            }
            csvWriter.writeNext(header);

            // Write rows
            for (T item : data) {
                String[] values = new String[fields.length];
                for (int i = 0; i < fields.length; i++) {
                    fields[i].setAccessible(true);
                    Object value;
                    try {
                        value = fields[i].get(item);
                    } catch (IllegalAccessException e) {
                        log.error("Failed to access field: {}", fields[i].getName(), e);
                        value = "";
                    }
                    values[i] = value != null ? value.toString() : "";
                }
                csvWriter.writeNext(values);
            }
        }

        byte[] csvBytes = stringWriter.toString().getBytes();

        return ExportResult.builder()
                .bytes(csvBytes)
                .filename(fileName + ".csv")
                .mediaType(MediaType.parseMediaType("text/csv"))
                .build();
    }

}
