package com.tutego.date4u.core.unicorn;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UnicornRepository extends JpaRepository<Unicorn, Long> {
  @Query( "SELECT u FROM Unicorn u WHERE u.email = :emailAddress" )
  Optional<Unicorn> findUnicornByEmail( String emailAddress );
}
