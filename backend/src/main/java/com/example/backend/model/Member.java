package com.example.backend.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Member {
    @Id
    private String id;
    private String pass;
    private String name;
    private LocalDateTime regdate;

    @Column(nullable = false)
    @ColumnDefault("ROLE_USER")
    private String role;
}
