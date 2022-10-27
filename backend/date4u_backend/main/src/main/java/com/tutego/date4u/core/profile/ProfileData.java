package com.tutego.date4u.core.profile;

import java.time.LocalDate;

public record ProfileData(
        LocalDate birthday,
        String nickname,
        Integer hornlength,
        Integer gender,
        Integer attractedToGender,
        String description
) {
}
