package com.bookbridge.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id")
    private String orderId;

    @Column(name = "book_id")
    private Long bookId;

    @Column(name = "buyer_id")
    private Long buyerId;

    @Column(name = "book_title")
    private String bookTitle;

    @Column(name = "book_author")
    private String bookAuthor;

    @Column(name = "book_image")
    private String bookImage;

    @Column(name = "seller_name")
    private String sellerName;

    @Column(name = "sell_price")
    private Double sellPrice;

    private String status;

    @Column(name = "order_date")
    private LocalDateTime orderDate;
}