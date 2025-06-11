package com.example.library.dto;

import com.example.library.entity.Book;
import com.example.library.entity.BookStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookListResponse {
    private Long id;            // 책 아이디
    private String name;        // 책 이름
    private String writer;      // 저자
    private String publisher;   // 출판사
    private String createDate;  // 출판일
    private Integer price;      // 가격
    private String status;      // 대출 상태 AVAILABLE 가능 ,NOTAVAILABLE 불가능

    public static BookListResponse from (Book book) {
        return BookListResponse.builder()
                .id(book.getId())
                .name(book.getName())
                .writer(book.getWriter())
                .publisher(book.getPublisher())
                .createDate(book.getCreateDate().toString())
                .price(book.getPrice())
                .status(book.getStatus().toString())
                .build();
    }

}
