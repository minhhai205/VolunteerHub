package project.web.backend.services;

import java.io.File;
import java.io.IOException;
import java.util.List;

public interface FileExportStrategy<T> {
    File export(List<T> data) throws IOException;
}
