package com.example.library.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class SigninRequest {
    private String email;
    private String password;
}
