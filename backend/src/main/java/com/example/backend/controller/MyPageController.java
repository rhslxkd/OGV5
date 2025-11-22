package com.example.backend.controller;


import com.example.backend.dto.BookingSummaryDto;
import com.example.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/my")
public class MyPageController {
    private final BookingService bookingService;

    @GetMapping("/bookings")
    public List<BookingSummaryDto> getMyBookings(
                                                 @AuthenticationPrincipal(expression = "username") String memberId) {// @AuthenticationPrincipal는 스프링 시큐리티에서 제공하는 어노테이션으로, 현재 인증된 사용자의 세부 정보를 컨트롤러 메서드의 매개변수로 주입하는 데 사용됩니다. expression = "username 로그인한 정보를 가져오겠다.
        if (memberId == null) {
            throw new RuntimeException("현재 로그인 정보가 없습니다.");
        }
        LocalDateTime now = LocalDateTime.now();
        // @AuthenticationPrincipal는 스프링 시큐리티에서 제공하는 어노테이션으로, 현재 인증된 사용자의 세부 정보를 컨트롤러 메서드의 매개변수로 주입하는 데 사용됩니다. expression = "username 로그인한 정보를 가져오겠다.
        return bookingService.getUpcomingBookingsForMember(memberId, now);
    }
}
