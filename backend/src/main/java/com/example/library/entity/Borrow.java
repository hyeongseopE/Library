package com.example.library.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Borrow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime createDate; // 대출한 날짜

    private LocalDateTime deadline;   // 마감기한

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BorrowStatus status = BorrowStatus.BORROW;      // 반납이면 RETURN, 대출중이면 BORROW

    @ManyToOne
    private Member member;

    @ManyToOne
    private Book book;

    public void isReturn(){
        this.status = BorrowStatus.RETURN;
    }



}
