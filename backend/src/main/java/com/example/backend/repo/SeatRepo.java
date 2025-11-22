package com.example.backend.repo;

import com.example.backend.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SeatRepo extends JpaRepository<Seat, Long> {

    @Query("""
            select s
            from Seat s
            where s.screen.screenId = :screenId
            order by s.seatRow asc, s.seatNo asc
    """)
    List<Seat> findAllByScreenIdOrderByRowCol(@Param("screenId") Long screenId);
}
