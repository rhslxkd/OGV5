package com.example.backend.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private Long id; //Long은 null값을 가질 수 있어서 기본형 int보다 좋음. long과 다른점은 long은 null값을 가질 수 없음. -> Long을 쓰는게 좋음. null값을 가지는게 좋은 이유는 DB에서 값을 안넣어줄때 null값이 들어가게 되는데, 기본형 long은 null값을 가질 수 없어서 에러가 발생함. 참고로 Long은 객체형, long은 기본형임. null을 가질 수 없으면 0으로 초기화됨. 초기화되면 의도치 않은 값이 들어갈 수 있음.

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_id")
    private Screen screen;

    @Column(name = "seat_row")
    private String seatRow;

    @Column(name = "seat_no")
    private int seatNo;

    @Column(name = "seat_label")
    private String seatLabel;

}
