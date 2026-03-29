package com.bookbridge.controller;

import com.bookbridge.model.Book;
import com.bookbridge.model.Order;
import com.bookbridge.repository.BookRepository;
import com.bookbridge.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BookRepository bookRepository;

    @PostMapping("/create")
    public Order createOrder(@RequestBody Order order) {

        order.setStatus("Ordered");
        order.setOrderDate(LocalDateTime.now());

        // Auto-populate book details from DB if not already provided
        if (order.getBookId() != null) {
            Optional<Book> bookOpt = bookRepository.findById(order.getBookId());
            if (bookOpt.isPresent()) {
                Book book = bookOpt.get();

                // Prevent race conditions: check if already sold
                if ("SOLD".equals(book.getStatus())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Book already purchased");
                }

                // Mark as sold
                book.setStatus("SOLD");
                bookRepository.save(book);

                if (order.getBookTitle() == null || order.getBookTitle().isEmpty()) {
                    order.setBookTitle(book.getTitle());
                }
                if (order.getBookImage() == null || order.getBookImage().isEmpty()) {
                    order.setBookImage(book.getImage());
                }
                if (order.getSellerName() == null || order.getSellerName().isEmpty()) {
                    order.setSellerName(book.getSellerName());
                }
                if (order.getSellPrice() == null) {
                    order.setSellPrice(book.getSellingPrice());
                }
            }
        }

        return orderRepository.save(order);
    }

    @GetMapping("/user/{buyerId}")
    public List<Order> getOrders(@PathVariable Long buyerId) {
        return orderRepository.findByBuyerId(buyerId);
    }
}