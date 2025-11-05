package project.web.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.EventRegistration;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {

    @Query("""
            SELECT er FROM EventRegistration er
            JOIN FETCH er.user u
            JOIN FETCH er.event e
            """)
    public Page<EventRegistration> getAll(Pageable pageable);
}
