# 📘 books-review-service

## 📝 Description

A lightweight, RESTful API built using **Flask**, **SQLAlchemy**, **Redis**, and **MySQL** for managing books and their reviews.  
This project is ideal for developers learning backend development, caching, database integration, automated testing, and REST API design using Python.

---

## 🚀 Features

- List all books and reviews.
- Add new books and reviews.
- Cache layer integration using Redis.
- SQLite (in-memory) support for tests and MySQL for production.
- OpenAPI (Swagger) documentation enabled via docstrings.
- Automated unit and integration tests with `pytest`.

---

## 🧪 Take-Home Exercise Requirements

### 1. API Design & Implementation

- **Framework:** Flask (Python)
- **Endpoints:**
  - `GET /books` – List all books
  - `POST /books` – Add a new book
  - `GET /books/{id}/reviews` – Get all reviews of a book
  - `POST /books/{id}/reviews` – Add a review to a book
- **Documentation:** OpenAPI-style docstrings available in each route

---

### 2. Data Modeling & Persistence

- **ORM:** SQLAlchemy
- **Database:** MySQL for production, SQLite for testing
- **Migrations:** Managed with Flask-Migrate + Alembic
- **Indexing:** Index added on `book_id` column of the `reviews` table for optimized lookup

---

### 3. Integration & Error Handling

- **Redis:** Used as cache to store book lists
  - On `GET /books`, it checks Redis first before falling back to DB
  - If Redis is down, it logs the error and fetches directly from DB
- **Error Handling:** Consistent JSON response format with status and messages

---

### 4. Automated Tests

- ✅ Unit Tests for:
  - `POST /books`
  - `GET /books`
- ✅ Integration Test:
  - Cache-miss path tested (fetches from DB and populates Redis)
- Framework: `pytest`

---

## 📚 API Reference

### 📖 Get all books

```http
GET /books

🖊️ Add a new book

POST /books

Field	Type	Required	Description
title	string	✅	Title of the book
author	string	✅	Author of the book
💬 Get reviews for a book

GET /books/{book_id}/reviews

Path Param	Type	Description
book_id	int	ID of the book
✍️ Add a review to a book

POST /books/{book_id}/reviews

Field	Type	Required	Description
content	string	✅	Content of the review
rating	int	✅	Rating (1 to 5)
