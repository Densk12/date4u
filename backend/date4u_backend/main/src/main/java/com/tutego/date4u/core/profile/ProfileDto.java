package com.tutego.date4u.core.profile;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record ProfileDto(
        Long id,
        String nickname,
        @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate birthday,
        Integer hornlength,
        Integer gender,
        @JsonProperty("attracted-to-Gender") Integer attractedToGender,
        String description
) {
    public static ProfileDto fromDomain(Profile profileDomain) {
        return new ProfileDto(
                profileDomain.getId(), profileDomain.getNickname(),
                profileDomain.getBirthdate(), profileDomain.getHornlength(),
                profileDomain.getGender(), profileDomain.getAttractedToGender(),
                profileDomain.getDescription()
        );
    }

    @Override
    public String toString() {
        return "ProfileDto{" + "id=" + id + ", brithday=" + birthday + ", hornlength=" + hornlength + ", gender=" + gender + ", attractedToGender=" + attractedToGender + '}';
    }
}
