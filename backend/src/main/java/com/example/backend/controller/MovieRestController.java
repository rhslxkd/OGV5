package com.example.backend.controller;


import com.example.backend.base.PageableResource;
import com.example.backend.base.PageableResourceImpl;
import com.example.backend.model.Movie;
import com.example.backend.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/movie")
public class MovieRestController {
    private final MovieService movieService;


    //전체 불러오기.
    @GetMapping("/main")
    public PageableResource main(
            @PageableDefault(value = 10)
            Pageable pageable) {
        //return movieService.findAll(pageable);
        Page<Movie> moviePage = movieService.findAll(pageable);

        PageableResource resources =
                new PageableResourceImpl(moviePage.getContent(),
                        0, moviePage.getTotalPages());
        resources.setMessage("영ㅇ화 페이지 취득 성공");
        return resources;
    }
    // 추가하기.
    @PostMapping(value = "/create",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)//구조상 value가 맞기 떄문.value는 경로이고, consumes는 요청의 content-type(서버에 내가 어떤 형태의 데이터를 보낼지 알려주는것) 멀티폼 저게 파일+ 텍스트 같이 전송으로, 이미지업로드, 게시글 작성에 쓰임ㅎㅎ
    public ResponseEntity<Movie> addMovie(@RequestPart Movie movie,
                                          @RequestPart(required = false) MultipartFile poster) throws IOException { //ResponseEntity로 받은 이유는 Movie를 리턴하기보단 html의 응답본문(body)로 받기위한 방법. //@RequestPart: 요청의 특정부분을 매핑해줌. Part는 Multipart/form-data의 부분. 여기선 title, director. 테스트 할거면 RequestBody를 사여ㅛㅇ해야해.
            Movie savedMovie = movieService.saveMovie(movie, poster); //Movie는 변수의 타입(model인 Movie Entity), DB 설계도: 이 변수에 들어올 데이터가 어떤 종류인지. savedMovie는 변수의 이름(내맴대로), movieService에 있는 saveMovie 함수를 호출해서 나온 Movie객체를 savedMovie라는 Movie 타입 변수에 저장해라.
            return ResponseEntity
                    .status(HttpStatus.CREATED) //.status는 ReponseEntity 클래스의 정적 메서드.(static) 인자로HttpStatus.Created를 주면 HTTP 상태 코드가 201Created인 ReponsiEntity를 만들곘다.
                    .body(savedMovie); //응답본문(body)를 savedMovie로 채우겠다. 스프링이 이걸 받고 Json Rest에서 뽑아내. DB에 commit까지 완료.

    }
    //하나만 불러오기
    @GetMapping("/{id}") //Get Mapping 어노테이션. /{id}는 경로를 받겠다. 즉 내가 세부사항 들어가면, api/movie/3 -> 3을 가져오고. @PathVariable을 통해서 long id가 3이 되버림.
    public ResponseEntity<Movie> getMovie(@PathVariable long id) { //url 경로에 있는 값을 가져오게 하는 어노테이션.
        Movie movie = movieService.selectMovieById(id); //movieService로 설정해두면, service에서 DB까지 연결해버림.
        return  ResponseEntity.ok().body(movie); //ResponseEntity로 하는 이유는 http에 그저 내용만 보내는게아닌, 상채 부분까지도 설정할 수가 잇음. 설정상태 즉 해드부분이 ok이면 body로 옮기고 실행하겠다.

    }
    //수정하기.
    @PutMapping(value = "/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Movie> updateMovie(@PathVariable long id,
                                             @RequestPart Movie movie,
                                             @RequestPart(required = false) MultipartFile poster) throws IOException {
        Movie uMovie = movieService.updateMovie(id, movie);
//        if(파일(포스터)이 있으면 ) 업로드;
        if (poster != null && !poster.isEmpty()) {
            movieService.updatePoster(id, poster);
        }
        return ResponseEntity.ok()
                .body(uMovie);
    }

    //삭제하기.
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Movie> deleteMovie(@PathVariable long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok().build(); //build는 응답 객체를 조립해서 완성해라. 본문없는 ResponseEntity생성 -> 삭제완료. (본문이 필요없을 때 쓰는 마무리 메서드),body는 비워줌
    }

    //현재 상영중인 영화들
//    @GetMapping("/now") //Get Mapping 어노테이션. /{id}는 경로를 받겠다. 즉 내가 세부사항 들어가면, api/movie/3 -> 3을 가져오고. @PathVariable을 통해서 long id가 3이 되버림.
//    public List<Movie> nowShowing() { //url 경로에 있는 값을 가져오게 하는 어노테이션.
//        return movieService.getNowShowingMovies(); //movieService로 설정해두면, service에서 DB까지 연결해버림.
//    }


}
