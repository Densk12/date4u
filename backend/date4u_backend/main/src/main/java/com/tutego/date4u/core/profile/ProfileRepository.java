package com.tutego.date4u.core.profile;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
//    @Query("SELECT p FROM Profile p WHERE p.nickname = :nickname")
//    Profile findProfileByNickname(String nickname);
//
//    @Query("SELECT p FROM Profile p WHERE p.nickname LIKE %:partialName%")
//    List<Profile> findProfilesByContainingName(String partialName);
//
//    @Query("SELECT p FROM Profile p WHERE p.hornlength BETWEEN :min AND :max")
//    List<Profile> findProfilesByHornlengthBetween(short min, short max);

//     Derived Query Methods
//     https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods.query-creation
//    Optional<Profile> findDistinctFirstProfileByOrderByHornlengthDesc();
//
//    List<Profile> findProfilesOrderByHornlengthDesc();
//
//    List<Profile> findByHornlengthGreaterThan(short min);
//
//    List<Profile> findFirst10ByOrderByLastseenDesc();

//    @Query("""
//            SELECT p
//            FROM   Profile p
//            WHERE  (p.attractedToGender=:gender OR p.attractedToGender IS NULL)
//               AND (p.gender = :attractedToGender OR :attractedToGender IS NULL)
//               AND (p.hornlength BETWEEN :minHornlength AND :maxHornlength)
//               AND (p.birthdate  BETWEEN :minBirthdate  AND :maxBirthdate)""")
//    List<Profile> search(byte gender, Byte attractedToGender,
//                         LocalDate minBirthdate, LocalDate maxBirthdate,
//                         short minHornlength, short maxHornlength);

    @Query("""
            SELECT p
            FROM   Profile p
            WHERE  (p.gender = :gender)
               AND (p.hornlength BETWEEN :minHornlength AND :maxHornlength)
               AND (p.birthdate  BETWEEN :minBirthdate  AND :maxBirthdate)""")
    Page<Profile> search(byte gender,
                         LocalDate minBirthdate, LocalDate maxBirthdate,
                         short minHornlength, short maxHornlength, PageRequest pageRequest);

    default Page<Profile> search(SearchFilter filter, PageRequest pageRequest) {
        return search(
                (byte) filter.gender(),
                filter.minBirthdate(),
                filter.maxBirthdate(),
                (short) filter.minHornlength(),
                (short) filter.maxHornlength(),
                pageRequest
        );
    }
}
