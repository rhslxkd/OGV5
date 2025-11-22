package com.example.backend.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long id; //bookingId보다는 id가 더 관례임. 왜냐면 @Entity마다 PK가 id이기 때문. 무슨 의미냐면 JPA가 자동으로 매핑할때 id를 PK로 인식하기 때문.

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showtime_id")
    private ShowTime showTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id")
    private Seat seat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private String status = "CONFIRMED"; //예약 상태. 기본값은 CONFIRMED. CANCELLED도 있음.

    @Column(name = "booked_at")
    private LocalDateTime bookedAt = LocalDateTime.now(); //예약 시간. 기본값은 현재 시간.
}
