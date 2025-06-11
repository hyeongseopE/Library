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
    private Long borrowId;  // 대출 아이디
    private String bookName;  // 책이름
    private String borrower;  // 대출자
    private String createDate; // 빌린날
    private String deadLine;  // 마감일
    private String status;    // 상태

    public static BorrowListResponse from(Borrow borrow){
        return BorrowListResponse.builder()
                .borrowId(borrow.getId())
                .bookName(borrow.getBook().getName())
                .borrower(borrow.getMember().getName())
                .createDate(borrow.getCreateDate().toString())
                .deadLine(borrow.getDeadline().toString())
                .status(borrow.getStatus().toString())
                .build();

    }
}
