package com.example.library.dto;

import com.example.library.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserListResponse {
    private Long id;
    private String name;
    private String email;
    private String password;
    private String tel;

    public static UserListResponse from(Member member){
        return UserListResponse.builder()
                .id(member.getId())
                .name(member.getName())
                .email(member.getEmail())
                .password(member.getPassword())
                .tel(member.getTel())
                .build();
    }
}
