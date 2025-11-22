package com.example.backend.model;

import com.example.backend.base.IEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity //Entity화 시키는거임.
@Getter // @Data를 사용하면 안댐.
@Setter
public class Board implements IEntity {
    @Id //Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long num;
    private String title;
    private String content;
    private String id;
    private LocalDateTime postdate;
    private int visitcount;


    public  void update(String title, String content) {
        this.title = title;
        this.content = content;
    }
}
