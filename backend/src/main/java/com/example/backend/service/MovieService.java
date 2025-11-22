package com.example.backend.service;

import com.example.backend.model.Movie;
import com.example.backend.repo.MovieRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class MovieService extends BassTransactionalService {

    private final MovieRepo movieRepo;
    private final FileStorageService storageService;

    //다 불러오기 + pageable
    public Page<Movie> findAll(Pageable pageable) {
        return movieRepo.findAll(pageable);
    }

    //추가하기(save인 이유는 react에서 추가나 수정을 할 때 사용하는 기능. 새 엔티티(id)가 없어. -> insert(추가), 새 앤티틱 아냐 (id)가 있어 -> update(수정)
    public Movie saveMovie(Movie movie, MultipartFile poster) throws IOException {
        if (poster !=null && !poster.isEmpty()) {
            //이미지 파일이 존재하고 0바이트가 아닐때
            var  saved = storageService.storePoster(poster);
            movie.setPosterFilename(saved.subdir() + "/" + saved.filename());
            movie.setPosterUrl(saved.url());
            movie.setPosterSize(saved.size());
            movie.setPosterMime(saved.mime());
        }
        return movieRepo.save(movie);
    }

    //하나만 불러오기 상세
    public Movie selectMovieById(long id) { //public으로 인해 다른 class나 js에서도 접근 가능. Movie model로 리턴 받음. 그리고 sel..이름. 그리고 (long id)는 id 값을 받는데, PK같은 느낌. 즉 저렇게 함으로써 api/movie/3이면 id는 3으로 받아.
        return movieRepo.findById(id) // movieRepo JPA에서 제공하는 findById를 통해서 (id = primary key, movie에선 movie_id)를 찾아와.
                .orElseThrow(() -> //영화 id가 DB에 있으면 가져오고, 없으면 예외를 던져라. ()이라는 거는 무명 함수. 예외를 던지는 식임(람다식), () -> new IllegalArgumentException 던지는 값은 괄호 안. id(ex:3 Movie not Found)
                        new IllegalArgumentException("Movie not found" + id));
    }

    //불러온 창에서 수정하기.
    public Movie updateMovie(Long id, Movie movie) { //반환타입은 Movie 객체 하나. 그리고 long id의 id: 수정할 대상의 PK, movie는 새로 입력된 수정 데이터. ()는 함수를 어떻게 사용할거다를 알려줌
        Movie uMovie = movieRepo.findById(id) // DB에서 id에 해당하는 데이터를 찾아와서 uMovie에 저장.
                .orElseThrow(() -> //아닐시(해당 id가 없으면)
                        new IllegalArgumentException("Movie not found" +id)); //fkaektlr
        uMovie.update(movie.getTitle(), movie.getDirector(), movie.getRunningMinutes()); //Movie model에서 함수 void덕분에 return 받지않고, 형식 그대로 가져옴.
        return uMovie;
    }

    // 포스터 수정
    public Movie updatePoster(Long id, MultipartFile poster) throws IOException {
        Movie uMovie = movieRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("movie not found"));
        var saved = storageService.storePoster(poster);
        uMovie.setPosterFilename(saved.subdir() + "/" + saved.filename());
        uMovie.setPosterUrl(saved.url());
        uMovie.setPosterSize(saved.size());
        uMovie.setPosterMime(saved.mime());
        return uMovie;
    }

    //삭제
    public void deleteMovie(Long id) {
        movieRepo.deleteById(id);
    }

    //현재상영중인 영화
    public List<Movie> getNowShowingMovies(LocalDateTime start, LocalDateTime end) { //반환타입은 Movie model의 List(여러개)형식.
        //LocalDateTime now = LocalDateTime.now(); //현재 시간을 now에 저장. -> import java.time.LocalDateTime; 필요
        return movieRepo.findNowShowing(start, end); //movieRepo의 findNowShowing함수를 호출하면서 now를 파라미터로 넘김. -> movieRepo에서 @Query로 작성한 쿼리가 실행됨.
    }

}
