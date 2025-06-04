package com.example.library.entity;

import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.annotations.Immutable;

@Entity
@Getter
public class Role {

    @Id
    @Immutable
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roleName;
}
