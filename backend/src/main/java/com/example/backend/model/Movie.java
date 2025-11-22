package com.example.backend.model;

import com.example.backend.base.IEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class Movie implements IEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //숫자키를 자동으로 올려주는것.
    private long movie_id;
    private String title;
    private String director;
    @Column(name="running_minutes") //이걸로 제대로 가져오면서. 밑의 문자열을 쉽게 바꿀 수 있음.
    private int runningMinutes;
    @Column(name = "poster_filename")
    private String posterFilename;
    @Column(name = "poster_url")
    private String posterUrl;
    @Column(name = "poster_size")
    private Long posterSize;
    @Column(name = "poster_mime")
    private String posterMime;

    public void update(String title, String director, int runningMinutes) { //ENtity내부에서 스스로 수정할 수 있는 권한을 주는 메서드. 여기다가 책임을 조금 덜음으로써 service 간추림. void는 반환하지 않겠다는 뜻.
        this.title = title;
        this.director = director; //여기서 this는 이 함수를 가지고 있는 자신. 즉 여기선 Movie인스턴스. service에서는 uMovie겠죵
        this.runningMinutes = runningMinutes;

    }
}
