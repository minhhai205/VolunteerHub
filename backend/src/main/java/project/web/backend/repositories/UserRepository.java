package project.web.backend.repositories;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.User;

import java.util.List;
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
            JOIN FETCH u.role r
            WHERE r.id=:id
            """)
    Optional<User> findByIdWithRole(@Param("id") Long id);

    @Query("""
            SELECT u FROM User u
            WHERE u.email=:email
            """)
    Optional<User> findByEmailWithNoReferences(@Param("email") String email);


    @Query("""
            SELECT u FROM User u
            JOIN FETCH u.role r
            WHERE
                r.name='USER'
                    OR
                r.name='MANAGER'
            """)
    Page<User> getAllUsersAndManagers(Pageable pageable);


}
