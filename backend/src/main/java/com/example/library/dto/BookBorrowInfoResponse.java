package com.example.library.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookBorrowInfoResponse {
    private Long userId;      // 대출자 아이디
    private String userName;  // 대출자 성함
    private String createDate; // 대출한 날짜
    private String deadLine;  // 마감일

}
