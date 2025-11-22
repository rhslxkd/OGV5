package com.example.backend.dto;

public record SeatStatusDto(
        Long seatId,
        String row,
        int col,
        String label,
        boolean taken, //이거는 나를 제외한 다른 사람이 예약한거
        boolean userTaken, //이거는 나 자신이 예약한거
        Long bookingIdForUser
) {
}
