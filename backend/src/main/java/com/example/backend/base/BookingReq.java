package com.example.backend.base;

//부킹 요청 레코드
public record BookingReq(
        Long showtimeId, Long seatId
) {

}
