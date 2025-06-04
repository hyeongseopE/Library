package com.example.library.dto;

import com.example.library.entity.Borrow;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BorrowListResponse {
    private String bookName;  // 책이름
    private String borrower;  // 대출자
    private String deadLine;  // 마감일
    private String status;    // 상태

    public static BorrowListResponse from(Borrow borrow){
        return BorrowListResponse.builder()
                .bookName(borrow.getBook().getName())
                .borrower(borrow.getMember().getName())
                .deadLine(borrow.getDeadline().toString())
                .status(borrow.getBook().getStatus().toString())
                .build();

    }
}
