package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "SHOWTIME") //대문자로 하는게 관례임. 근데 JPA가 자동으로 매핑해주긴 함. 안돼서 적는거임.
public class ShowTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "showtime_id")
    private Long showtimeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id")
    private Movie movie;  //연결되면 movie_id로 들어감. -> 쿼리가 비효율적이긴 함. ShowTime을 불러오면 movie도 불러오고 그래서 조인쿼리가 발생함. 조인쿼리란 두개 이상의 테이블을 합쳐서 데이터를 가져오는 쿼리. 하지만 JPA가 알아서 최적화를 해줌.

    @ManyToOne(fetch = FetchType.LAZY) //ManyToOne은 기본이 EAGER임. 그래서 LAZY로 바꿔줘야함. EAGER는 무조건 가져오는것. LAZY는 필요할때 가져오는것. -> 성능에 더 좋음.
    @JoinColumn(name = "screen_id") //최소한 이정도는 써줘야함.
    private Screen screen; //연결되면 screen_id로 들어감. 왜냐하면 Screen엔티티의 PK가 screen_id이기 때문.

    @Column(name = "starts_at")
    private LocalDateTime startsAt;
    @Column(name = "ends_at")
    private LocalDateTime endsAt;
}
