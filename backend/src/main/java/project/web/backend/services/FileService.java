package project.web.backend.services;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import project.web.backend.exceptions.AppException;
import project.web.backend.utils.commons.ExportResult;
import project.web.backend.utils.enums.ErrorCode;
import project.web.backend.utils.enums.ExportFormat;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {
    // Inject all FileExportStrategy beans
    private final List<FileExportStrategy<?>> strategyList;

    // Map built after bean initialization
    private Map<String, FileExportStrategy<?>> strategies;

    @PostConstruct
    void init() {
        this.strategies = strategyList.stream()
                .collect(Collectors.toMap(s -> s.getClass().getAnnotation(Component.class).value(), Function.identity()));
        log.info("Registered export strategies: {}", strategies.keySet());
    }

    @SuppressWarnings("unchecked")
    public <T> ExportResult export(List<T> data, ExportFormat format, String fileName) throws Exception {
        String strategyName = format.name();

        FileExportStrategy<T> strategy = (FileExportStrategy<T>) strategies.get(strategyName);
        if (strategy == null) {
            throw new AppException(ErrorCode.FILE_FORMAT_UNSUPPORTED);
        }

        log.info("Using strategy: {}", strategyName);
        return strategy.export(data, fileName);
    }
}
