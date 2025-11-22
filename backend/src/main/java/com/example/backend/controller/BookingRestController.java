package com.example.backend.controller;

import com.example.backend.base.BookingReq;
import com.example.backend.base.BookingRes;
import com.example.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookings")
public class BookingRestController {
    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> book(@RequestBody BookingReq req,
                                  @AuthenticationPrincipal(expression = "username") String memberId) { // @AuthenticationPrincipal는 스프링 시큐리티에서 제공하는 어노테이션으로, 현재 인증된 사용자의 세부 정보를 컨트롤러 메서드의 매개변수로 주입하는 데 사용됩니다. expression = "username 로그인한 정보를 가져오겠다.
        Long id = bookingService.bookSeat(req.showtimeId(),
                req.seatId(), memberId);
        return ResponseEntity.ok(new BookingRes(id));
    }
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id,
                                    @AuthenticationPrincipal(expression = "username") String memberId) {
        bookingService.cancel(id, memberId);
        return ResponseEntity.ok().build();
    }
}
