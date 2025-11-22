package com.example.backend.model;


import com.example.backend.base.IEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Screen implements IEntity { //IEntity를 상속받음으로써 엔티티라는 것을 명시. -> JPA가 관리할 수 있게됨. 그럼 페이징도 가능.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //숫자키를 자동으로 올려주는것. -> DB가 자동으로 값을 넣어줌. -> insert할때 null로 넣어도됨.
    @Column(name = "screen_id")
    private Long screenId;

    @Column(name = "name")
    private String screenName;

    @Column(name = "seat_rows")
    private Integer seatRows;

    @Column(name = "seat_columns")
    private Integer seatColumns;
}
