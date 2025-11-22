package com.example.backend.repo;

import com.example.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.backend.dto.BookingSummaryDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepo
        extends JpaRepository<Booking, Long> {

    // 좌석이 이미 존재하는지 아닌지 확인(CONFIRMED 상태인지)
//    boolean exitsByShowtimeShowtimeIdAndSeatIdAndStatus (
//            Long showtimeId,
//            Long seatId,
//            String status
//    );

    //해당회차/좌석의 예약정보 가져오기
    Optional<Booking> findByShowTimeShowtimeIdAndSeat_Id( //Optional<Booking>을 사용하는 이유는, 해당 회차와 좌석에 대한 예약 정보가 없을 수도 있기 때문입니다. 이 경우 null을 반환하는 대신 Optional.empty()를 반환하여, 호출자가 명시적으로 예약 정보의 존재 여부를 처리할 수 있도록 합니다.
            Long showtimeId,
            Long seatId
    );

    @Query("""
        select b.seat.id
        from Booking b
        where b.showTime.showtimeId = :showtimeId
        and b.status = 'CONFIRMED'
""")
    List<Long> findConfirmedSeatIds(@Param("showtimeId") Long showtimeId);

    @Query("""
        select b.seat.id, b.id
        from Booking b
        where b.showTime.showtimeId = :showtimeId
        and b.member.id = :memberId
        and b.status = 'CONFIRMED'
    """)
    List<Object[]> findUserConfirmedSeatIds(@Param("showtimeId") Long showtimeId,
                                           @Param("memberId") String memberId);

    @Query("""
        select new com.example.backend.dto.BookingSummaryDto(
            b.id,
            m.title,
            m.posterUrl,
            sc.screenName,
            s.seatLabel,
            st.startsAt,
            b.bookedAt,
            b.status
        )
        from Booking b
        join b.showTime st
        join st.movie m
        join st.screen sc
        join b.seat s
        where b.member.id = :memberId
        and st.startsAt >= :form
        order by st.startsAt asc
""")
    List<BookingSummaryDto> findUpcomingBookingsForMember(
            @Param("memberId") String memberId,
            @Param("form") LocalDateTime form
            );
}
