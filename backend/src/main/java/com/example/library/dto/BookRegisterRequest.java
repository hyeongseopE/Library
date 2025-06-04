package com.example.library.dto;

import lombok.Data;

@Data
public class BookRegisterRequest {
    private String bookName;    // 책이름
    private String writer;      // 저자
    private String publisher;   // 출판사
    private Integer price;      // 가격
}
