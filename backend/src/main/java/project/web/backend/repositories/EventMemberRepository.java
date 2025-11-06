package project.web.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.EventMember;

@Repository
public interface EventMemberRepository extends JpaRepository<EventMember, Long> {
}
