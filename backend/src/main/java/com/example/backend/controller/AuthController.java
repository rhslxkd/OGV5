package com.example.backend.controller;
import com.example.backend.base.LoginRequest;
import com.example.backend.base.MeResponse;
import com.example.backend.base.RegisterRequest;
import com.example.backend.model.Member;
import com.example.backend.repo.MemberRepo;
import com.example.backend.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final MemberRepo memberRepo;

    //아이디 중복체크
    @GetMapping("/id-available")
    public Map<String, Boolean> idAvailable(
            @RequestParam String id) {
        boolean exists = memberRepo.existsById(id);
        return Map.of("available", !exists); //exists가 true면 사용불가이므로 !exists를 반환. available이 true면 사용가능. k1은 v2의 형태. -> {"available": true} or {"available": false} 좀 더 자세히말하자면 Map.of는 키-값 쌍을 포함하는 불변 맵을 생성하는 Java의 정적 메서드입니다. 여기서 "available"은 키이고 !exists는 그에 해당하는 값입니다. 즉, 이 메서드는 클라이언트에게 아이디 사용 가능 여부를 JSON 형식으로 응답합니다.
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Validated @RequestBody RegisterRequest req) throws IllegalAccessException {
        authService.register(req);
        return ResponseEntity.ok().build();
    }

    private final SecurityContextRepository
            securityContextRepository =
            new HttpSessionSecurityContextRepository();


// 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req,
                                   HttpServletRequest request,
                                   HttpServletResponse response) {
        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(req.id(), req.pass());

        Authentication auth = authenticationManager.authenticate(token); //일종의 증표
//        SecurityContextHolder.getContext().setAuthentication(auth); //시큐리티컨텍스트에 인증정보 저장
//        request.getSession(true); // 세션 강제 생성
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);

        //JSESSIONID 발급확정.
        securityContextRepository.saveContext(context, request, response); //request.getSession(true)이게 안돼서 이걸로(수동)

        Member m = memberRepo.findById(req.id()).orElseThrow();
        return ResponseEntity.ok(new MeResponse(m.getId(), m.getName(),
                m.getRole()));
    }

// 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        request.getSession(false);
        if (request.getSession(false) != null) {
            System.out.println("logout invalidate");
            request.getSession(false).invalidate();
        }
        SecurityContextHolder.clearContext();

        //쿠키삭제 (안사라져도 정상임)
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        response.addCookie(cookie);

        return ResponseEntity.ok().build();

    }

}
