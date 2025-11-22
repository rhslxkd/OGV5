package com.example.backend.controller;


import com.example.backend.dto.ShowtimeItem;
import com.example.backend.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/movies")
public class ShowtimeRestController {

    private final ShowtimeService showtimeService;

    @GetMapping("/{id}/showtimes")
    public List<ShowtimeItem> getShowtimesByMovieId(@org.springframework.web.bind.annotation.PathVariable("id") int movieId) {
        return showtimeService.findByMoiveId(movieId);
    }
}
