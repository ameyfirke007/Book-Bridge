# 📚 BookBridge – Student Book Exchange Platform

BookBridge is a full-stack web application designed to help students buy and sell used academic books easily within their college community. It connects buyers and sellers, making textbooks more affordable and accessible.

## 🚀 Features

* 🔐 User Authentication (Signup/Login)
* 📘 Sell Books with detailed information
* 🛒 Buy Books from other students
* 📦 Order Management System
* 📊 User Dashboard with activity tracking
* 🏫 College-based marketplace (e.g., Terna Engineering College)
* 💬 Chatbot integration (via n8n)
* 📱 Responsive and user-friendly UI

## 🛠️ Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Spring Boot (Java)
* **Database:** MySQL
* **API Communication:** REST APIs
* **Tools:** Maven, Git, VS Code

## 🔗 Project Architecture

Frontend (HTML/JS) → Spring Boot Backend → MySQL Database

## ⚙️ How to Run

1. Clone the repository
2. Create a MySQL database named `bookbridge`
3. Run the provided SQL scripts to create tables and insert data
4. Configure `application.properties` with your DB credentials
5. Start backend using:

   ```
   mvn spring-boot:run
   ```
6. Open in browser:

   ```
   http://localhost:8080/index.html
   ```

## 📌 Key Highlights

* Transitioned from localStorage-based system to full backend integration
* Implemented REST APIs for real-time data handling
* Modular project structure with clean separation of concerns
* Scalable design for multi-college expansion

## 📈 Future Enhancements

* Payment Gateway Integration
* Real-time Chat between users
* Advanced search & filtering
* Mobile App version

## 👨‍💻 Author

Developed by Amey Firke
