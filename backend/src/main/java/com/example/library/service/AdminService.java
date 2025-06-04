package com.example.library.service;


import com.example.library.dto.BookRegisterRequest;
import com.example.library.dto.BookUpdateRequest;
import com.example.library.dto.BorrowListResponse;
import com.example.library.dto.BorrowRequest;
import com.example.library.entity.Book;
import com.example.library.entity.BookStatus;
import com.example.library.entity.Borrow;
import com.example.library.entity.Member;
import com.example.library.repository.BookRepository;
import com.example.library.repository.BorrowRepository;
import com.example.library.repository.MemberRepository;
import com.example.library.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final BookRepository bookRepository;
    private final BorrowRepository borrowRepository;
    private final RoleRepository roleRepository;
    private final MemberRepository memberRepository;


    /**
     * 대출 신청
     *
     * @param request
     * @param requestUser
     * @return
     */
    @Transactional
    public ResponseEntity<Void> borrowRequest(BorrowRequest request, UserDetails requestUser){

        Book book = bookRepository.findById(request.bookId()).orElse(null);
        if(book == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // 책 상태가 이미 대출 불가능한 상태면 400 에러
        if(book.getStatus() == BookStatus.NOTAVAILABLE){return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();}

        // 유저를 못 찾음 401, admin 등급이 아니면 403에러
        Member member = memberRepository.findByEmail(requestUser.getUsername()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,"해당 유저를 찾을 수 없습니다."));
        if(!member.getRole().getRoleName().equals("admin")){return ResponseEntity.status(HttpStatus.FORBIDDEN).build();}

        // 마감일 설정 => 15일 뒤 23:59 분 까지
        LocalDateTime deadLine = LocalDateTime.now()
                .plusDays(15)
                .withHour(23)
                .withMinute(59)
                .withSecond(0)
                .withNano(0);

        // 대출 이력 남기기
        Borrow borrow = Borrow.builder()
                .createDate(LocalDateTime.now())
                .deadline(deadLine)
                .member(member)
                .book(book)
                .build();
        borrowRepository.save(borrow);

        // 책 대출상태 불가능 만들기
        book.isBorrow();
        bookRepository.save(book);

        return ResponseEntity.ok().build();
    }


    /**
     * 책 반납
     *
     * @param request
     * @param requestUser
     */
    @Transactional
    public void returnRequest(BorrowRequest request, UserDetails requestUser){
        Book book = bookRepository.findById(request.bookId()).orElse(null);
        if(book == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        // 유저를 못 찾음 401, admin 등급이 아니면 403에러
        Member member = memberRepository.findByEmail(requestUser.getUsername()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,"해당 유저를 찾을 수 없습니다."));
        if(!member.getRole().getRoleName().equals("admin")){throw new ResponseStatusException(HttpStatus.FORBIDDEN);}

        Borrow borrow = borrowRepository.findByBookAndMember(book, member).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        book.isReturn();
        borrow.isReturn();

        bookRepository.save(book);
        borrowRepository.save(borrow);

    }

    /**
     * 어드민 관리자 메인 페이지
     *
     * @param requestUser
     * @return BorrowListResponse
     */
    public List<BorrowListResponse> adminMainPage(UserDetails requestUser){
        Member member = memberRepository.findByEmail(requestUser.getUsername()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if(!member.getRole().getRoleName().equals("admin")){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        List<Borrow> borrows = borrowRepository.findAllByOrderByCreateDateDesc();

        return borrows.stream().map(BorrowListResponse::from).toList();

    }

    /**
     * 책 등록
     *
     * @param requestUser
     * @param request
     */
    public void bookRegister(UserDetails requestUser, BookRegisterRequest request){
        Member member = memberRepository.findByEmail(requestUser.getUsername()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if(!member.getRole().getRoleName().equals("admin")){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        bookRepository.save(Book.builder()
                        .name(request.getBookName())
                        .writer(request.getWriter())
                        .publisher(request.getPublisher())
                        .createDate(LocalDateTime.now())
                        .price(request.getPrice())
                        .status(BookStatus.AVAILABLE)
                        .build());

    }

    /**
     * 책 수정
     */
    @Transactional
    public void bookUpdate(UserDetails requestUser, BookUpdateRequest request){
        Member member = memberRepository.findByEmail(requestUser.getUsername()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if(!member.getRole().getRoleName().equals("admin")){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        Book book = bookRepository.findById(request.getBookId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        book.update(request);
        bookRepository.save(book);

    }


}
