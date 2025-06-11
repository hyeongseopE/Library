package com.example.library.entity;

import com.example.library.dto.UserUpdateRequest;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Member {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "m_name")
    private String name;

    @Column(name = "m_email",nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column
    private String tel;

    @Column
    @Enumerated(EnumType.STRING)
    private MemberStatus status = MemberStatus.ACTIVATE;

    @ManyToOne
    private Role role;

    public void update(UserUpdateRequest request, String pass){
        this.name = request.getName();
        this.tel = request.getTel();
        this.password = "".equals(pass) ? this.password : pass;
    }

    public void isOver(){
        this.status = MemberStatus.DEACTIVATE;
    }


}
