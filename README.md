# 📘 Books-Review-Service

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
```

🖊️Add a new book
```http
    POST /books
```
| Field  | Type   | Required | Description        |
| ------ | ------ | -------- | ------------------ |
| title  | string | ✅        | Title of the book  |
| author | string | ✅        | Author of the book |

###💬 Get reviews for a book
  ```http
     GET /books/{book_id}/reviews
  ```

 | Path Param | Type | Description    |
 | ---------- | ---- | -------------- |
 | book\_id   | int  | ID of the book |


✍️ Add a review to a book
  ```http
     POST /books/{book_id}/reviews
  ```
 | Field   | Type   | Required | Description           |
 | ------- | ------ | -------- | --------------------- |
 | content | string | ✅        | Content of the review |
 | rating  | int    | ✅        | Rating (1 to 5)       |




📦 Installation & Setup
1. Clone the repository

git clone https://github.com/your-username/books-review-service.git
cd books-review-service/book-review-api

2. Create and activate a virtual environment

python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

3. Install dependencies

pip install -r requirements.txt

4. Configure database

In config.py, update your DB URI:

SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:1234@localhost/book_review_db"

5. Run migrations

flask db init
flask db migrate -m "Initial migration"
flask db upgrade

6. Start Redis server

Make sure Redis is running locally:

sudo service redis-server start  # or `redis-server`

7. Start the Flask server

flask run

# 🧪Running Tests
   From root project directory
   PYTHONPATH=. pytest tests/
   

# ✅ requirements.txt
```Flask==2.3.2
   Flask-SQLAlchemy==3.1.1
   Flask-Migrate==4.0.5
   PyMySQL==1.1.0
   redis==5.0.1
   pytest==8.2.2
   pytest-flask==1.3.0
```
##Install with:

pip install -r requirements.txt
