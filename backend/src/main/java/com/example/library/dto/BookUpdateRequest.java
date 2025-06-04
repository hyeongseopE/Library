package com.example.library.dto;

import lombok.Data;

@Data
public class BookUpdateRequest {
    private Long bookId;        // 책 아이디
    private String bookName;    // 책이름
    private String writer;      // 저자
    private String publisher;   // 출판사
    private Integer price;      // 가격
}
