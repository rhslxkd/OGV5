package com.example.backend.security;


import com.example.backend.repo.BoardRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("boardSec") //여기저기서 사용될떄 "boardSec"이라는 이름으로 사용 가능
@RequiredArgsConstructor
public class BoardSecurity {
    private  final BoardRepo boardRepo;


    //글의 소유자(오너)인지 아닌지
    public boolean isOwner(Long boardNum, Authentication auth) {
        if (auth == null) {
            return false;
        }
        return boardRepo.findById(boardNum)
                .map(b -> b.getId().equals(auth.getName()))
                .orElse(false);
    }
}
