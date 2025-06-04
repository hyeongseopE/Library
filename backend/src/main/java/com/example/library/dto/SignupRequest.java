package com.example.library.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignupRequest {
    private String email;
    private String password;
    private String name;
}
