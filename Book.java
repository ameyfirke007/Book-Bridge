package com.bookbridge.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String author;

    private String branch;

    private String subject;

    @Column(name = "condition_type")
    private String condition;

    @Column(name = "original_price")
    private Double originalPrice;

    @Column(name = "selling_price")
    private Double sellingPrice;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String image;

    @Column(name = "seller_id")
    private Long sellerId;

    @Column(name = "seller_name")
    private String sellerName;

    @Column(name = "seller_college")
    private String sellerCollege;

    private Boolean verified;

    @Column(name = "listed_date")
    private LocalDate listedDate;

    @Builder.Default
    @Column(name = "status")
    private String status = "AVAILABLE";
}
