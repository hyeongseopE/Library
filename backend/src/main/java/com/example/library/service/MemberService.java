package com.example.library.service;

import com.example.library.dto.*;
import com.example.library.entity.Book;
import com.example.library.entity.BookStatus;
import com.example.library.entity.Borrow;
import com.example.library.entity.Member;
import com.example.library.repository.BookRepository;
import com.example.library.repository.BorrowRepository;
import com.example.library.repository.MemberRepository;
import com.example.library.repository.RoleRepository;
import com.sun.jdi.request.DuplicateRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;
    private final BookRepository bookRepository;
    private final BorrowRepository borrowRepository;

    public SigninResponse signin(SigninRequest request){
        Member member = memberRepository.findByEmail(request.getEmail()).orElse(null);
        if(member != null){
            if(passwordEncoder.matches(request.getPassword(),member.getPassword())){
                String access_token = jwtService.generateToken(member.getEmail(),"access_token");
                return SigninResponse.builder()
                        .accessToken(access_token)
                        .build();
            }
        }
        return SigninResponse.builder().error("Unknown Member").build();
    }

    public String signup(SignupRequest request){
        Member member = memberRepository.findByEmail(request.getEmail()).orElse(null);
        if(member != null){
            throw new DuplicateRequestException("이미 존재하는 계정입니다.");
        }
        Member saved = memberRepository.save(Member.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(roleRepository.findByRoleName(request.getEmail()).orElse(null))
                .build());
        if(saved != null){
            return "회원가입 성공";
        }else{
            return "회원가입 실패";
        }
    }

    /**
     * 일반 사용자의 검색 결과 화면
     *
     * @param searchText
     * @param searchType
     * @return
     */
    public List<BookListResponse> searchBookList(String searchText, String searchType){
        String searchPattern = '%'+searchText+'%';
        Pageable page = PageRequest.of(0,10, Sort.by("name"));

        List<Book> books ;

        if(searchType.equals("제목")){
            books = bookRepository.findBySearchTextWithName(searchPattern, page);
        }else if (searchType.equals("저자")){
            books = bookRepository.findBySearchTextWithWriter(searchPattern, page);
        }else {
            books = bookRepository.findBySearchTextWithPublisher(searchPattern, page);
        }

        return books.stream().map(BookListResponse::from).toList();

    }





}
