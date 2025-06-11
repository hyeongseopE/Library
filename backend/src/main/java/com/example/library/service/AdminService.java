package com.example.library.service;


import com.example.library.dto.*;
import com.example.library.entity.*;
import com.example.library.repository.BookRepository;
import com.example.library.repository.BorrowRepository;
import com.example.library.repository.MemberRepository;
import com.example.library.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final BookRepository bookRepository;
    private final BorrowRepository borrowRepository;
    private final RoleRepository roleRepository;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;


    /**
     * 대출 신청
     *
     * @param request
     * @return
     */
    @Transactional
    public ResponseEntity<Void> borrowRequest(BorrowRequest request){

        Book book = bookRepository.findById(request.bookId()).orElse(null);
        if(book == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // 책 상태가 이미 대출 불가능한 상태면 400 에러
        if(book.getStatus() == BookStatus.NOTAVAILABLE){return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();}

        // 유저를 못 찾음 400,
        Member member = memberRepository.findById(request.user()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"해당 유저를 찾을 수 없습니다."));

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
                .status(BorrowStatus.BORROW)
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
     */
    @Transactional
    public void returnRequest(ReturnRequest request){
        System.out.println(request.borrowId());
        if(request.borrowId() != null){
            Borrow borrow = borrowRepository.findById(request.borrowId()).orElse(null);
            if(borrow != null){
                borrow.getBook().isReturn();
                borrow.isReturn();
                return;
            }
        }

        Book book = bookRepository.findById(request.bookId()).orElse(null);
        if(book == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        // 대출 이력, 유저를 못 찾음 403,
        Member member = memberRepository.findById(request.userId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"해당 유저를 찾을 수 없습니다."));
        Borrow borrow = borrowRepository.findTopByBookAndMemberOrderByCreateDateDesc(book,member)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        book.isReturn();
        borrow.isReturn();

        bookRepository.save(book);
        borrowRepository.save(borrow);
    }

    /**
     * 어드민 책 관리 페이지
     *
     * @param requestUser
     * @return BorrowListResponse
     */
    public List<BookListResponse> adminMainPage(UserDetails requestUser){
        Member member = memberRepository.findByEmail(requestUser.getUsername()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if(!member.getRole().getRoleName().equals("admin")){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        List<Book> books = bookRepository.findAllByOrderByCreateDateDesc();

        return books.stream().map(BookListResponse::from).toList();

    }

    /**
     * 책 관리 페이지 책 검색기능
     *
     * @param searchText
     * @return
     */
    public List<BookListResponse> adminBookSearch(String searchText){
        String searchPatten = '%'+searchText+'%';
        return bookRepository.findAllBySearchText(searchPatten).stream()
                .map(BookListResponse::from).toList();
    }

    /**
     * 유저 등록
     *
     * @param request
     */
    public void adminRegisterUser(UserRegisterRequest request){
        // 이미 존재하는 유저
        if(memberRepository.findByEmail(request.getEmail()).orElse(null) != null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        // user role
        Role role = roleRepository.findByRoleName("user").orElse(null);
        memberRepository.save(Member.builder()
                        .name(request.getName())
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .tel(request.getTel())
                        .role(role)
                .build());
    }

    /**
     *  유저 정보 수정페이지
     *
     * @param request
     */
    @Transactional
    public void adminUpdateUser(UserUpdateRequest request){
        Member member = memberRepository.findById(request.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));


        // 요청 패스워드가 빈 값이면 기존 패스워드
        String pass="";
        if(request.getPassword() != null && !request.getPassword().isBlank()){
             pass = passwordEncoder.encode(request.getPassword());
        }
        member.update(request,pass);

        memberRepository.save(member); // 저장
    }


    /**
     * 유저 관리 페이지
     *
     * @param requestUser
     * @return
     */
    public List<UserListResponse> adminUserPage(UserDetails requestUser){
        Member member = memberRepository.findByEmail(requestUser.getUsername()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if(!member.getRole().getRoleName().equals("admin")){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        Role role = roleRepository.findByRoleName("admin").orElse(null);
        return memberRepository.findAllByRoleNot(role).stream().map(UserListResponse::from).toList();

    }

    /**
     *  유저 검색
     * @param searchText
     * @return UserListResponse
     */
    public List<UserListResponse> adminUserSearch(String searchText){
        String searchPatten = '%'+searchText+'%';
        return memberRepository.findAllBySearchText(searchPatten)
                .stream().map(UserListResponse::from).toList();
    }

    /**
     * 한 유저 대출이력
     *
     * @param userId
     * @return BorrowListResponse
     */
    public List<BorrowListResponse> adminUserHistory(Long userId){
        Member member = memberRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return borrowRepository.findAllByMember(member)
                .stream().map(BorrowListResponse::from).toList();
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
                        .createDate(LocalDate.now())
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

        Book book = bookRepository.findById(request.getId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        book.update(request);
        bookRepository.save(book);

    }

    /**
     * 책 현제 대출내역 상세
     *
     * @param bookId
     * @return BookBorrowInfoResponse
     */
    public BookBorrowInfoResponse adminBorrowDetails(Long bookId){
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        Borrow borrow = borrowRepository.findTopByBookOrderByCreateDateDesc(book).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return BookBorrowInfoResponse.builder()
                .userId(borrow.getMember().getId())
                .userName(borrow.getMember().getName())
                .createDate(borrow.getCreateDate().toString())
                .deadLine(borrow.getDeadline().toString())
                .build();
    }

    /**
     *  대출 내역 리스트
     *
     * @return BorrowListResponse
     */
    public List<BorrowListResponse> adminBorrowHistory(){
        return borrowRepository.findAllByOrderByCreateDateDesc().stream()
                .map(BorrowListResponse::from).toList();
    }

    /**
     * 책 연체 검사
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void checkOverDue(){
        List<Borrow> borrows = borrowRepository.findAll().stream().filter(borrow -> borrow.getStatus() != BorrowStatus.RETURN).toList();

        for(Borrow borrow : borrows){
            if(borrow.getDeadline().isBefore(LocalDateTime.now())){
                borrow.isOver();
                borrow.getBook().isOver();
                borrow.getMember().isOver();
            }
        }

    }




}
