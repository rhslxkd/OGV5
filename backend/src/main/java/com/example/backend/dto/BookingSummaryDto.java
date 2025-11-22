package com.example.backend.dto;

import java.time.LocalDateTime;

public record BookingSummaryDto(
        Long bookingId,
        String movieTitle,
        String posterUrl,
        String screenName,
        String seatLabel,
        LocalDateTime startsAt,
        LocalDateTime bookedAt,
        String status
) {

}
