package com.bookbridge.repository;

import com.bookbridge.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByBranch(String branch);

    List<Book> findBySubject(String subject);

    List<Book> findBySellerId(Long sellerId);

    List<Book> findByStatus(String status);

    List<Book> findByStatusOrStatusIsNull(String status);
}