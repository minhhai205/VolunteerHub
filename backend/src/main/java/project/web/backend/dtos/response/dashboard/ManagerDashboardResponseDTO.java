package project.web.backend.dtos.response.dashboard;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ManagerDashboardResponseDTO implements Serializable {
    private Long totalEvents;           // Tổng số sự kiện mà manager đã tạo
    private Long totalVolunteers;       // Tổng số tình nguyện viên tham gia sự kiện của manager
    private Long trendingEvents;        // Số sự kiện đang trending
    private Long totalNewDiscussionPosts; // Số bài đăng / thảo luận mới trong các sự kiện của manager
}

