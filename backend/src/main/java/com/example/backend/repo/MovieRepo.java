package com.example.backend.repo;


import com.example.backend.model.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface MovieRepo extends JpaRepository<Movie, Long> {

    //페이지
    @Query("select m from Movie m order by m.movie_id desc ")
    Page<Movie> findAll(Pageable pageable);


    //현재 상영중인 영화 목록
    @Query("""
            select distinct m
            from ShowTime st join st.movie m
            where st.startsAt between :start
            and :end
    """)
    List<Movie> findNowShowing(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
