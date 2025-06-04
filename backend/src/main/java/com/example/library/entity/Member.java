package com.example.library.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Member {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(name = "m_name")
    private String name;

    @Column(name = "m_email",nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToOne
    private Role role;


}
