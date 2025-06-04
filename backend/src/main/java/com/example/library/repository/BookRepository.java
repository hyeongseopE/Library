package com.example.library.repository;

import com.example.library.entity.Book;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<Book,Long> {

    @Query("select b " +
            "from Book b " +
            "where b.name like :searchText ")
    List<Book> findBySearchTextWithName(@Param("searchText") String searchText, Pageable pageable);

    @Query("select b " +
            "from Book b " +
            "where b.writer like :searchText ")
    List<Book> findBySearchTextWithWriter(@Param("searchText") String searchText, Pageable pageable);

    @Query("select b " +
            "from Book b " +
            "where b.publisher like :searchText ")
    List<Book> findBySearchTextWithPublisher(@Param("searchText") String searchText, Pageable pageable);
}
