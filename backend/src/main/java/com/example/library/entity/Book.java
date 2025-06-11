package com.example.library.entity;

import com.example.library.dto.BookUpdateRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;         // 제목

    private String writer;       // 저자

    private String publisher;    // 출판사

    private LocalDate createDate; // 출간년도

    private Integer price;            // 가격

    @Enumerated(EnumType.STRING)
    private BookStatus status;            // 대출가능, 대충불가능

    // 대출함
    public void isBorrow(){
        this.status = BookStatus.NOTAVAILABLE;
    }
    // 반납함
    public void isReturn(){
        this.status = BookStatus.AVAILABLE;
    }

    public void isOver(){
        this.status = BookStatus.OVERDUE;
    }

    public void update(BookUpdateRequest request){
        this.name = request.getName();
        this.writer = request.getWriter();
        this.publisher = request.getPublisher();
        this.createDate = request.getCreateDate();
        this.price = request.getPrice();
    }
}
