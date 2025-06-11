package com.example.library.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BookUpdateRequest {
    private Long id;        // 책 아이디
    private String name;    // 책이름
    private String writer;      // 저자
    private String publisher;   // 출판사
    private LocalDate createDate; // 출판일
    private Integer price;      // 가격
}
