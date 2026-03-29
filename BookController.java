package com.bookbridge.controller;

import com.bookbridge.model.Book;
import com.bookbridge.repository.BookRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
@CrossOrigin("*")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    // Matches /api/books/sell used in sell.js
    @PostMapping("/sell")
    public Book sellBook(@RequestBody Book book) {
        return bookRepository.save(book);
    }

    // Matches /api/books used in books.js
    @PostMapping
    public Book addBook(@RequestBody Book book) {
        return bookRepository.save(book);
    }

    // Matches /api/books used in most frontend get all calls
    @GetMapping
    public List<Book> getAllBooks() {
        return bookRepository.findByStatusOrStatusIsNull("AVAILABLE");
    }

    // Left for legacy compatibility if anything still calls /all
    @GetMapping("/all")
    public List<Book> getAllBooksLegacy() {
        return bookRepository.findByStatusOrStatusIsNull("AVAILABLE");
    }

    @GetMapping("/branch/{branch}")
    public List<Book> getBooksByBranch(@PathVariable String branch) {
        return bookRepository.findByBranch(branch);
    }

    @GetMapping("/subject/{subject}")
    public List<Book> getBooksBySubject(@PathVariable String subject) {
        return bookRepository.findBySubject(subject);
    }

    @GetMapping("/{id}")
    public Book getBookById(@PathVariable Long id) {
        return bookRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable Long id) {
        bookRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @RequestBody Book updates) {
        Optional<Book> existing = bookRepository.findById(id);
        if (existing.isPresent()) {
            updates.setId(id);
            return bookRepository.save(updates);
        }
        return null;
    }
}
