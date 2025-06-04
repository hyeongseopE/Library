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
    private String name;
    private String writer;
    private String publisher;
    private String createDate;
    private Integer price;
    private String status;

    public static BookListResponse from (Book book) {
        return BookListResponse.builder()
                .name(book.getName())
                .writer(book.getWriter())
                .publisher(book.getPublisher())
                .createDate(book.getCreateDate().toString())
                .price(book.getPrice())
                .status(book.getStatus().toString())
                .build();
    }

}
