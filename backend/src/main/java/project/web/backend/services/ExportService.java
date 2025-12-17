package project.web.backend.services;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import project.web.backend.dtos.response.user.EventMemberResponseDTO;
import project.web.backend.entities.EventMember;
import project.web.backend.exceptions.AppException;
import project.web.backend.repositories.EventMemberRepository;
import project.web.backend.utils.commons.ExportResult;
import project.web.backend.utils.enums.ErrorCode;
import project.web.backend.utils.enums.ExportFormat;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExportService {
    private final FileService fileService;
    private final EventMemberRepository eventMemberRepository;

    public ExportResult exportEventMembers(Long id, String format) {
        try {
            ExportFormat exportFormat = ExportFormat.from(format);

            if (exportFormat == ExportFormat.UNKNOWN) {
                throw new AppException(ErrorCode.FILE_FORMAT_UNSUPPORTED);
            }

            // Fetch all members for event (use unpaged to get all)
            List<EventMember> members = eventMemberRepository
                    .findByFilter(null, null, id, Pageable.unpaged())
                    .getContent();

            // Map to export DTO
            List<EventMemberResponseDTO> dtos = members.stream().map(em -> {
                Long workingHour = null;
                if (em.getCreatedAt() != null) {
                    workingHour = Duration.between(em.getCreatedAt().toInstant(), Instant.now()).toHours();
                }
                return EventMemberResponseDTO.builder()
                        .id(em.getId())
                        .memberName(em.getUser() != null ? em.getUser().getFullName() : null)
                        .email(em.getUser() != null ? em.getUser().getEmail() : null)
                        .eventName(em.getEvent() != null ? em.getEvent().getName() : null)
                        .registrationDate(em.getCreatedAt())
                        .workingHour(workingHour)
                        .status(em.getStatus())
                        .build();
            }).collect(Collectors.toList());

            // If no data, return minimal file depending on format
            if (dtos.isEmpty()) {
                String baseName = "event_" + id + "_members";
                if (exportFormat == ExportFormat.JSON) {
                    return ExportResult.builder()
                            .bytes("[]".getBytes())
                            .filename(baseName + ".json")
                            .mediaType(MediaType.APPLICATION_JSON)
                            .build();
                } else { // CSV
                    // Provide header line compatible with EventMemberResponseDTO fields
                    String header = "id,memberName,email,eventName,registrationDate,workingHour,status\n";
                    return ExportResult.builder()
                            .bytes(header.getBytes())
                            .filename(baseName + ".csv")
                            .mediaType(MediaType.parseMediaType("text/csv"))
                            .build();
                }
            }

            return fileService.export(dtos, exportFormat, "event_" + id + "_members");
        } catch (AppException ae) {
            throw ae;
        } catch (Exception e) {
            log.error("Failed to export participants", e);
            throw new RuntimeException("Export failed");
        }
    }
}
