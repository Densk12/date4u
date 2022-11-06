package com.tutego.date4u.core.security;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record RegistrationDto(
        @NotEmpty
        @Email
        String email,
        @NotEmpty
        @Size(min = 2)
        String password,
        @NotNull
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        LocalDate birthday,
        @NotEmpty
        @Size(min = 2)
        String nickname,
        @NotNull
        @Min(1)
        @Max(30)
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
}