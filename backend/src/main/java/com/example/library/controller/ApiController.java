package com.example.library.controller;

import com.example.library.dto.*;
import com.example.library.service.AdminService;
import com.example.library.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApiController {

    private final MemberService memberService;
    private final AdminService adminService;

    @PostMapping("/signin")
    public ResponseEntity<SigninResponse> signin(@RequestBody SigninRequest request){
        SigninResponse res = memberService.signin(request);
        if(res.getError() != null){
            return new ResponseEntity<>(res, HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(res,HttpStatus.OK);
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request){
        return ResponseEntity.ok(memberService.signup(request));
    }

    /**
     *  일반 사용자 책 검색 결과
     */
    @GetMapping("/user/search")
    public ResponseEntity<List<BookListResponse>> searchBookList(@Param("searchText") String searchText,
                                                                 @Param("searchType") String searchType){
        return ResponseEntity.ok(memberService.searchBookList(searchText,searchType));
    }

    /**
     *  어드민 사용자가 대출 신청하기
     */
    @PostMapping("/admin/borrow")
    public ResponseEntity<Void> borrowRequest(@RequestBody BorrowRequest request, @AuthenticationPrincipal UserDetails requestUser){
        return adminService.borrowRequest(request,requestUser);
    }

    /**
     *  어드민 반납 신청
     */
    @PostMapping("/admin/return")
    public ResponseEntity<Void> returnRequest(@RequestBody BorrowRequest request, @AuthenticationPrincipal UserDetails requestUser){
        adminService.returnRequest(request, requestUser);
        return ResponseEntity.ok().build();
    }

    /**
     * 어드민 관리 메인 페이지
     */
    @PostMapping("/admin/mainpage")
    public ResponseEntity<List<BorrowListResponse>> adminMainPage(@AuthenticationPrincipal UserDetails requestUser ){
        return ResponseEntity.ok(adminService.adminMainPage(requestUser));
    }

    /**
     * 어드민 책 등록
     */
    @PostMapping("/admin/book/register")
    public ResponseEntity<Void> bookRegister(@AuthenticationPrincipal UserDetails requestUser,
                                             @RequestBody BookRegisterRequest request){
        adminService.bookRegister(requestUser, request);
        return ResponseEntity.ok().build();
    }


    /**
     *  어드민 책 수정
     */
    @PostMapping("/admin/book/update")
    public ResponseEntity<Void> bookUpdate(@AuthenticationPrincipal UserDetails requestUser,
                                           @RequestBody BookUpdateRequest request){
        adminService.bookUpdate(requestUser, request);
        return ResponseEntity.ok().build();
    }






}
