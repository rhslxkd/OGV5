package com.example.backend.service;

import com.example.backend.dto.ShowtimeItem;
import com.example.backend.repo.ShowtimeRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ShowtimeService extends BassTransactionalService{

    private final ShowtimeRepo showtimeRepo;

    public List<ShowtimeItem> findByMoiveId(@Param("movie_id") int movieId) {
        return showtimeRepo.findByMovieId(movieId);
    }
}
