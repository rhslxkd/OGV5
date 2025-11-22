package com.example.backend.controller;

import com.example.backend.base.PageableResource;
import com.example.backend.base.PageableResourceImpl;
import com.example.backend.model.Board;
import com.example.backend.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/board")
public class BoardRestController { //REST(Represetative(url), State(상태), Transter(전송)
    private final BoardService boardService;

    //게시물 목록 (BoardList)
    @GetMapping("/main")
    public PageableResource main(
            @PageableDefault(size = 10)
            Pageable pageable) {

        //return boardService.findAll();
        Page<Board> boardPage = boardService.findAll(pageable);

        PageableResource resouces =
            new PageableResourceImpl(boardPage.getContent(),
                    0, boardPage.getTotalPages());
        resouces.setMessage("게시판 취득 성공");
        return resouces;
    }
    //글 추가
    @PostMapping(value = "/create",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Board> addBoard(@RequestPart Board board) {
        board.setPostdate(LocalDateTime.now());
        Board savedBoard = boardService.saveBoard(board);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedBoard);
    }
    //글 불러오기
    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoard(@PathVariable long id) {
        Board board =boardService.findBoardById(id);
        return ResponseEntity.ok()
                .body(board);
    }
    //조회수 증가
    @PostMapping("/{id}/counts")
    public  ResponseEntity<Map<String, Object>> visitCountBoard(@PathVariable long id) {
        int newCount = boardService.incrementVisitCount(id);
        return ResponseEntity.ok().body(Map.of("visitCount", newCount));
    }
    //글수정
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or @boardSec.isOwner(#id, authentication)") //ADMIN이거나 글쓴이 본인일때만 수정 가능
    public ResponseEntity<Board> updateBoard(@PathVariable long id,
                                             @RequestPart Board board) {
        Board uBoard = boardService.updateBoard(id, board);
        return ResponseEntity.ok()
                .body(uBoard);
    }
    //글 삭제
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @boardSec.isOwner(#id, authentication)")
    public ResponseEntity<Board> deleteBoard(@PathVariable long id) {
        boardService.deleteBoard(id);
        return ResponseEntity.ok().build();
    }




}
