package com.example.library.repository;

import com.example.library.entity.Book;
import com.example.library.entity.Borrow;
import com.example.library.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BorrowRepository extends JpaRepository<Borrow, Long> {
    List<Borrow> findAllByOrderByCreateDateDesc();

    Optional<Borrow> findByBookAndMember(Book book, Member member);
}
