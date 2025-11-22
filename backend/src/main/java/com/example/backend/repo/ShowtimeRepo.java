package com.example.backend.repo;

import com.example.backend.model.ShowTime;
import com.example.backend.dto.ShowtimeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShowtimeRepo extends JpaRepository<ShowTime, Long> {


    @Query("""
            select new com.example.backend.dto.ShowtimeItem(
               st.showtimeId,st.startsAt, st.endsAt, sc.screenName
             )
             from ShowTime st
             join st.screen sc
             where st.movie.movie_id = :movieId
             order by st.startsAt asc
   """)
    List<ShowtimeItem> findByMovieId(@Param("movieId") int movieId);
}
