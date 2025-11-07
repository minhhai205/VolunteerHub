package project.web.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import project.web.backend.entities.Token;

import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, String> {
    @Query("""
            SELECT t FROM Token t
            WHERE t.jti=:jti
            """)
    public Optional<Token> findByJti(@Param("jti") String jti);


    @Transactional
    @Modifying
    @Query("""
            DELETE FROM Token t
            WHERE t.jti=:jti
            """)
    public void deleteByJti(@Param("jti") String jti);

    @Transactional
    @Modifying
    @Query("""
            DELETE FROM Token t
            WHERE t.email=:email
            """)
    public void deleteAllByEmail(@Param("email") String email);
}
