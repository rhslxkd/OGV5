package com.example.backend.repo;


import com.example.backend.model.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface BoardRepo extends JpaRepository<Board, Long> { //Dao와 DaoImpl합침.
    @Query("select b from Board b order by b.postdate desc")
    List<Board> findAll();

    //페이지
    @Query("select b from Board b order by b.postdate desc")
    Page<Board> findAll(Pageable pageable);
    //조회수 증가
    @Modifying //변경까지 하겠다 이걸 해야 밑의 쿼리가 반영이 됨.
    @Query("update Board b set b.visitcount = b.visitcount + 1 where b.num = :id")
    int incrementVisitCount(@Param("id") Long id);
}
