package project.web.backend.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("""
            SELECT u FROM User u
            JOIN FETCH u.role r
            WHERE u.email=:email
            """)
    Optional<User> findByEmail(@Param("email") String email);

    @Query("""
            SELECT u FROM User u
            WHERE u.email=:email
            """)
    Optional<User> findByEmailWithNoReferences(@Param("email") String email);
}
