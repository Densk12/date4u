package com.tutego.date4u.core.profile;

import java.time.LocalDate;

public record SearchFilter(int gender,
                           LocalDate minBirthdate,
                           LocalDate maxBirthdate,
                           int minHornlength,
                           int maxHornlength) {
}
