package com.example.backend.controller;

import com.example.backend.dto.SeatStatusDto;
import com.example.backend.repo.BookingRepo;
import com.example.backend.repo.SeatRepo;
import com.example.backend.repo.ShowtimeRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
public class SeatController {
    private final SeatRepo seatRepo;
    private final ShowtimeRepo showtimeRepo;
    private final BookingRepo bookingRepo;

    @GetMapping("/api/showtimes/{id}/seats")
    @Transactional(readOnly = true)
    public List<SeatStatusDto> seatStatusDto(
            @PathVariable("id") Long showTimeId,
            @AuthenticationPrincipal(expression = "username") String memberId

    ) {
        var st = showtimeRepo.findById(showTimeId)
                .orElseThrow(() -> new RuntimeException("그런 상영회차는 없습니다"));
        Long screenId = st.getScreen().getScreenId();

        var seats = seatRepo.findAllByScreenIdOrderByRowCol(screenId);

        //중복자리 방지
        var takenIds = new HashSet<>(bookingRepo.findConfirmedSeatIds(showTimeId));

        //사용자 중복 자리 방지
//        var userTakenIds =
//                new HashSet<>(bookingRepo.findUserConfirmedSeatIds(showTimeId, memberId));
        //사용자가예약한 자리 정보 맵핑
        List<Object[]> seatBookings = bookingRepo.findUserConfirmedSeatIds(showTimeId, memberId);
        Map<Long, Long> seatBookingMap = new HashMap<>();
        for (Object[] seatBooking : seatBookings) {
            Long seatId = (Long) seatBooking[0];
            Long bookingId = (Long) seatBooking[1];
            seatBookingMap.put(seatId, bookingId);
        }

        return seats.stream()
                .map(s -> new SeatStatusDto(
                        s.getId(),
                        s.getSeatRow(),
                        s.getSeatNo(),
                        s.getSeatLabel(),
                        takenIds.contains(s.getId()),
                        seatBookingMap.containsKey(s.getId()),
                        seatBookingMap.get(s.getId())

                )).toList();
    }
}
