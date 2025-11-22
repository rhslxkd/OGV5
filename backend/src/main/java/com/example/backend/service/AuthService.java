package com.example.backend.service;

import com.example.backend.base.RegisterRequest;
import com.example.backend.model.Member;
import com.example.backend.repo.MemberRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final MemberRepo memberRepo;
    private final PasswordEncoder passwordEncoder;

    //회원가입
    public void register(RegisterRequest req) throws IllegalAccessException {
        //아이디중복체크
        if (memberRepo.existsById(req.id())) {
            throw new IllegalAccessException("이미 사용중인 아이디입니다.");
        }
        Member member = new Member();
        member.setId(req.id());
        member.setPass(passwordEncoder.encode(req.pass()));
        member.setName(req.name());
        member.setRegdate(LocalDateTime.now());
        member.setRole("ROLE_USER");
        memberRepo.save(member);
    }

}