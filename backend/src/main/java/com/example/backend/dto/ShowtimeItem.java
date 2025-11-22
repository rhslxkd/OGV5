package com.example.backend.dto;

import java.time.LocalDateTime;

public record ShowtimeItem(
        Long showtimeId,
        LocalDateTime startsAt,
        LocalDateTime endsAt,
        String screenName
) {
}