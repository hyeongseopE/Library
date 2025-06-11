package com.example.library.dto;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private Long Id;
    private String name;
    private String password;
    private String tel;
}
