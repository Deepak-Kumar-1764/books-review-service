from flask import Blueprint, request, jsonify
from app.models import db, Book
from app.redis_client import r  # import redis client
import json

books_bp = Blueprint('books', __name__)

@books_bp.route('/books', methods=['GET'])
def get_books():
    """
    Get all books
    ---
    tags:
      - Books
    responses:
      200:
        description: A list of books
        schema:
          type: object
          properties:
            status:
              type: string
            data:
              type: array
              items:
                type: object
                properties:
                  book_id:
                    type: integer
                  book_title:
                    type: string
                  book_author:
                    type: string
    """
    try:
        cached_books = r.get("books")  # Check Redis cache

        if cached_books:
            data = json.loads(cached_books)
            return jsonify({"status": "success", "status_code": 200, "source": "cache", "data": data})

    except Exception as e:
        print("Redis error:", str(e))

    # Fallback to DB
    books = Book.query.all()
    data = [{"book_id": b.id, "book_title": b.title, "book_author": b.author} for b in books]

    # Cache result in Redis
    try:
        r.setex("books", 60, json.dumps(data))  # cache for 60 seconds
    except Exception as e:
        print("Redis set error:", str(e))

    return jsonify({"status": "success", "status_code": 200, "source": "db", "data": data})
    
@books_bp.route('/books', methods=['POST'])
def add_book():
    """
    Add a new book
    ---
    tags:
      - Books
    parameters:
      - in: body
        name: book
        schema:
          type: object
          required:
            - title
            - author
          properties:
            title:
              type: string
            author:
              type: string
    responses:
      201:
        description: Book added successfully
      400:
        description: Missing title or author
    """
    data = request.get_json()
    title = data.get('title')
    author = data.get('author')

    if not title or not author:
        return jsonify({"status": "error", "status_code": 400, "message": "Title and Author are required"}), 400

    book = Book(title=title, author=author)
    db.session.add(book)
    db.session.commit()

    return jsonify({
        "status": "success", "status_code": 201, "message": "Book added successfully",
        "data": {"book_id": book.id, "book_title": book.title, "book_author": book.author}
    }), 201

