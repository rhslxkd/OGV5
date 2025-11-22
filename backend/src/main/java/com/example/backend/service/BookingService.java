package com.example.backend.service;

import com.example.backend.dto.BookingSummaryDto;
import com.example.backend.model.Booking;
import com.example.backend.repo.BookingRepo;
import com.example.backend.repo.MemberRepo;
import com.example.backend.repo.SeatRepo;
import com.example.backend.repo.ShowtimeRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService extends BassTransactionalService{
    private final BookingRepo bookingRepo;
    private final ShowtimeRepo showtimeRepo;
    private final SeatRepo seatRepo;
    private final MemberRepo memberRepo;

    public Long bookSeat(Long showtimeId, Long seatId, String memberId) {
        //1. 존재검증
        var st = showtimeRepo.findById(showtimeId)
                .orElseThrow(() -> new RuntimeException("상영중인 영화 없음"));

        var seat = seatRepo.findById(seatId)
                .orElseThrow(()-> new RuntimeException("그런 자리 없음"));

        var member = memberRepo.findById(memberId)
                .orElseThrow(() -> new RuntimeException("그런 회원 없음"));

        //해당 회차의 상영관인지 체크 -> 무슨 뜻이냐면 A상영관의 1번자리를 B상영관의 1번자리로 예약 못하게.
        if (!seat.getScreen().getScreenId().equals(st.getScreen().getScreenId())) {// 상영관 아이디가 자리랑 같지 않으면 예약을 못하게.
            throw new RuntimeException("해당 상영관에 없는 자리입니다");
        }

        var optionalBooking = bookingRepo.findByShowTimeShowtimeIdAndSeat_Id(showtimeId, seatId);
        if (optionalBooking.isPresent()) { // 기존 부킹이 있으면
            Booking booking = optionalBooking.get(); // 해당 부킹을 가져온다.

            //이미 CONFIRMED 상태면 재예약 안됨.
            if ("CONFIRMED".equals(booking.getStatus())) {
                throw new RuntimeException("이미 예약된 자리입니다");
            }

            booking.setStatus("CONFIRMED");
            booking.setMember(member);
            booking.setBookedAt(LocalDateTime.now());

            return booking.getId();
        }

        try { //2. 예약
            var b = new Booking(); // new Booking 객체 생성
            b.setShowTime(st); // showtime 설정
            b.setSeat(seat); // seat 설정
            b.setMember(member); // member 설정
            return bookingRepo.save(b).getId(); // 저장 후 ID 반환
        }catch (Exception e) { // 예외 처리
            e.printStackTrace(); // 예외 정보 출력
            throw new RuntimeException("이미 예매된 좌석입니다."); // 예외 발생 시 메시지 반환
        }
    }

    public void cancel(Long id, String memberId) {
        var b = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("없는 예매내역입니다"));

        if (!b.getMember().getId().equals(memberId)) {
            throw new RuntimeException("본인의 예매내역만 취소할 수 있습니다");
        }

        b.setStatus("CANCELLED");
    }

    public List<BookingSummaryDto> getUpcomingBookingsForMember(String memberId, LocalDateTime form) {

        return bookingRepo.findUpcomingBookingsForMember(memberId, form);
    }
}
