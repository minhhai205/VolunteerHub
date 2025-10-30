package project.web.backend.services;

import java.io.IOException;
import java.util.List;

import project.web.backend.utils.commons.ExportResult;

public interface FileExportStrategy<T> {
    ExportResult export(List<T> data, String fileName) throws IOException;
}
