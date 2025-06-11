package com.example.library;

import com.example.library.entity.Book;
import com.example.library.entity.BookStatus;
import com.example.library.entity.Member;
import com.example.library.entity.Role;
import com.example.library.repository.BookRepository;
import com.example.library.repository.MemberRepository;
import com.example.library.repository.RoleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.stream.IntStream;

@SpringBootTest
class LibraryApplicationTests {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

//    @Test
    public void insertDummyBooks() {
        IntStream.rangeClosed(1, 10).forEach(i -> {
            Book book = Book.builder()
                    .name("테스트 책 제목 " + i)
                    .writer("저자 " + i)
                    .publisher("출판사 " + i)
                    .price(10000 + i * 500)
                    .createDate(LocalDate.now().minusYears(i)) // 과거 출간일
                    .status(BookStatus.AVAILABLE)
                    .build();
            bookRepository.save(book);
        });
    }

//    @Test
    public void insertRole(){
        roleRepository.save(Role.builder()
                .roleName("user")
                .build());
    }

//    @Test
    public void insertAdmin(){
        Role role = roleRepository.findByRoleName("admin").orElse(null);

        memberRepository.save(Member.builder()
                        .name("admin")
                        .email("admin")
                        .password(passwordEncoder.encode("1234"))
                        .role(role)
                .build());
    }



}
