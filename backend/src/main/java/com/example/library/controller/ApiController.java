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
    public ResponseEntity<List<BookListResponse>> searchBookList(@RequestParam("searchText") String searchText,
                                                                 @RequestParam("searchType") String searchType){
        System.out.println("searchText:"+searchText+" searchType:"+searchType);
        return ResponseEntity.ok(memberService.searchBookList(searchText,searchType));
    }

    /**
     *  일반 사용자 책 전체 리스트
     */
    @GetMapping("/user/booklist")
    public ResponseEntity<List<BookListResponse>> allBookList(){
        return ResponseEntity.ok(memberService.allBookList());
    }

    /**
     *  일반 사용자 책 날짜 최신순 정렬
     */
    @GetMapping("/user/sort/createdate")
    public ResponseEntity<List<BookListResponse>> orderByCreateDate(){
        return ResponseEntity.ok(memberService.orderByCreateDate());
    }

    /**
     * 일반 사용자 책 이름순 정렬
     */
    @GetMapping("/user/sort/name")
    public ResponseEntity<List<BookListResponse>> orderByName(){
        return ResponseEntity.ok(memberService.orderByName());
    }

    /**
     *  어드민 사용자가 대출 신청하기
     */
    @PostMapping("/admin/book/borrow")
    public ResponseEntity<Void> borrowRequest(@RequestBody BorrowRequest request){
        return adminService.borrowRequest(request);
    }

    /**
     *  어드민 반납 신청
     */
    @PostMapping("/admin/book/return")
    public ResponseEntity<Void> returnRequest(@RequestBody ReturnRequest request){
        adminService.returnRequest(request);
        return ResponseEntity.ok().build();
    }

    /**
     * 어드민 책 관리 페이지
     */
    @GetMapping("/admin/bookpage")
    public ResponseEntity<List<BookListResponse>> adminMainPage(@AuthenticationPrincipal UserDetails requestUser ){
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
     *  어드민 북 검색
     */
    @GetMapping("/admin/book/search")
    public ResponseEntity<List<BookListResponse>> adminBookSearch(@RequestParam("searchText")String searchText ){
        return ResponseEntity.ok(adminService.adminBookSearch(searchText));
    }

    /**
     *  어드민 책 수정
     */
    @PutMapping("/admin/book/update")
    public ResponseEntity<Void> bookUpdate(@AuthenticationPrincipal UserDetails requestUser,
                                           @RequestBody BookUpdateRequest request){
        adminService.bookUpdate(requestUser, request);
        return ResponseEntity.ok().build();
    }

    /**
     *  사용자 관리 페이지
     */
    @GetMapping("/admin/userpage")
    public ResponseEntity<List<UserListResponse>> adminUserPage(@AuthenticationPrincipal UserDetails requestUser){
        return ResponseEntity.ok(adminService.adminUserPage(requestUser));
    }

    /**
     *  사용자 검색
     */
    @GetMapping("/admin/user/search")
    public ResponseEntity<List<UserListResponse>> adminUserSearch(@RequestParam("searchText")String searchText){
        return ResponseEntity.ok(adminService.adminUserSearch(searchText));
    }

    /**
     * 사용자 대출 이력
     */
    @GetMapping("/admin/user/history")
    public ResponseEntity<List<BorrowListResponse>> adminUserHistory(@RequestParam("userId")Long userId){
        return ResponseEntity.ok(adminService.adminUserHistory(userId));
    }

    /**
     *  사용자 등록
     */
    @PostMapping("/admin/register-user")
    public ResponseEntity<Void> adminRegisterUser(@RequestBody UserRegisterRequest request){
        adminService.adminRegisterUser(request);
        return ResponseEntity.ok().build();
    }

    /**
     * 사용자 업데이트
     */
    @PutMapping("/admin/update-user")
    public ResponseEntity<Void> adminUpdateUser(@RequestBody UserUpdateRequest request){
        adminService.adminUpdateUser(request);
        return ResponseEntity.ok().build();
    }

    /**
     *  책의 현재 대출상세
     */
    @GetMapping("/admin/borrow/book/{bookId}")
    public ResponseEntity<BookBorrowInfoResponse> adminBorrowDetails(@PathVariable(name = "bookId")Long bookId){
        return ResponseEntity.ok(adminService.adminBorrowDetails(bookId));
    }

    /**
     *  대출 내역 리스트
     */
    @GetMapping("/admin/borrow/history")
    public ResponseEntity<List<BorrowListResponse>> adminBorrowHistory(){
        return ResponseEntity.ok(adminService.adminBorrowHistory());
    }







}
