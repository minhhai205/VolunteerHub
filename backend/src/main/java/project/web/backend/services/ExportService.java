package project.web.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import project.web.backend.entities.Event;
import project.web.backend.entities.EventMember;
import project.web.backend.entities.User;
import project.web.backend.utils.commons.ExportResult;
import project.web.backend.utils.enums.ExportFormat;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExportService {
    private final FileService fileService;
    
    public ExportResult exportEventMembers(Long id, String format) {
    // Fake data for testing
        User user1 = User.builder()
            .id(1L)
            .email("alice@example.com")
            .fullName("Alice")  
            .password(null)        
            .status(null)      
            .phoneNumber(null)       
            .role(null)             
            .members(null)
            .creationRequests(null)
            .registrationRequests(null)
            .posts(null)
            .comments(null)
            .notifications(null)
            .achievements(null)
            .build();

        User user2 = User.builder()
            .id(2L)
            .email("bob@example.com")
            .fullName("Bob")
            .password(null)
            .status(null)
            .phoneNumber(null)
            .role(null)
            .members(null)
            .creationRequests(null)
            .registrationRequests(null)
            .posts(null)
            .comments(null)
            .notifications(null)
            .achievements(null)
            .build();


    // Mock Event (other fields null)
        Event event = Event.builder()
            .id(1L)
            .name("Workshop")
            .description(null)
            .location(null)
            .startDate(null)
            .endDate(null)
            .manager(null)
            .categories(null)
            .members(null)
            .posts(null)
            .build();

    
        List<EventMember> participants = List.of(
            EventMember.builder().id(1L).event(event).user(user1).build(),
            EventMember.builder().id(2L).event(event).user(user2).build()
        );

        try {
            ExportFormat exportFormat = ExportFormat.valueOf(format.toUpperCase());
            return fileService.export(participants, exportFormat, "event_"+ id + "_members");
        } catch (Exception e) {
            log.error("Failed to export participants", e);
            throw new RuntimeException("Export failed");
        }
    }
}
