package com.example.backend.controller;

import com.example.backend.model.Movie;
import com.example.backend.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/home")
public class HomeRestController {

    private final MovieService movieService;

    @GetMapping("/now")
    public List<Movie> nowShowing() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = LocalDateTime.of(now.getYear(), now.getMonth(),
                now.getDayOfMonth(), 0, 0, 0);
        LocalDateTime end = LocalDateTime.of(now.getYear(), now.getMonth(),
                now.getDayOfMonth() + 1, 12, 0, 0);
        return movieService.getNowShowingMovies(start, end);
    }

    //하나만 불러오기
    @GetMapping("/movies/{id}") //Get Mapping 어노테이션. /{id}는 경로를 받겠다. 즉 내가 세부사항 들어가면, api/movie/3 -> 3을 가져오고. @PathVariable을 통해서 long id가 3이 되버림.
    public ResponseEntity<Movie> getMovie(@PathVariable long id) { //url 경로에 있는 값을 가져오게 하는 어노테이션.
        Movie movie = movieService.selectMovieById(id); //movieService로 설정해두면, service에서 DB까지 연결해버림.
        return  ResponseEntity.ok().body(movie); //ResponseEntity로 하는 이유는 http에 그저 내용만 보내는게아닌, 상채 부분까지도 설정할 수가 잇음. 설정상태 즉 해드부분이 ok이면 body로 옮기고 실행하겠다.

    }
}
