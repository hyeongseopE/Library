package com.example.library.repository;

import com.example.library.entity.Member;
import com.example.library.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member,Long> {

    Optional<Member> findByEmail(String email);

    Optional<Member> findById(Long id);

    List<Member> findAllByRoleNot(Role role);

    @Query("select m " +
            "from Member m " +
            "where (cast(m.id as String) like :searchText) " +
            "or m.name like :searchText or m.email like :searchText")
    List<Member> findAllBySearchText(@Param("searchText") String searchText);
}
