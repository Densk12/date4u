package com.tutego.date4u.core.profile;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record ProfileDto(
        @NotNull
        @Min(1)
        Long id,
        @NotEmpty
        @Size(min = 2)
        String nickname,
        @NotNull
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        LocalDate birthday,
        @NotNull
        @Min(0)
        @Max(3)
        Integer hornlength,
        @NotNull
        @Min(0)
        @Max(3)
        Integer gender,
        @NotNull
        @Min(0)
        @Max(3)
        @JsonProperty("attracted-to-gender")
        Integer attractedToGender,
        @NotEmpty
        @Size(min = 2)
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
