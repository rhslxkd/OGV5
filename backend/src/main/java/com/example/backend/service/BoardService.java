package com.example.backend.service;

import com.example.backend.model.Board;
import com.example.backend.repo.BoardRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@RequiredArgsConstructor //AutoWIred같은거.
@Service
public class BoardService extends BassTransactionalService {

    private final BoardRepo boardRepo;
//    public BoardService(BoardRepo boardRepo) {
//        this.boardRepo = boardRepo;
//    } 이게 Lombok을 안썼을 떄(Required)

    public Page<Board> findAll(Pageable pageable) {
        return boardRepo.findAll(pageable); // select * ..등등의 쿼리가 필요가 없어. 우와...

    }

    public Board saveBoard(Board board) {
        return boardRepo.save(board);
    }

    public Board findBoardById(long id) {
        return boardRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Board not found" + id));
    }

    public Board updateBoard(Long id, Board board) {
        Board uBoard = boardRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Board not found" + id));
        uBoard.update(board.getTitle(), board.getContent());
        return uBoard;
    }

    public void  deleteBoard(Long id) {
        boardRepo.deleteById(id);
    }

    //조회수 증가
    public int incrementVisitCount(Long id) {
        int update = boardRepo.incrementVisitCount(id);
        if (update > 0) {
            return boardRepo.findById(id).orElseThrow().getVisitcount();
        } else {
            throw new EntityNotFoundException("조회수 증가에 실패했습니다");
        }
    }
 }
