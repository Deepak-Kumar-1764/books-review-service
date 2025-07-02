from flask import Blueprint, request, jsonify
from app.models import db, Review
from app.redis_client import r  # Redis client
import json

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/books/<int:book_id>/reviews', methods=['GET'])
def get_reviews(book_id):
    """
    Get reviews for a book
    ---
    tags:
      - Reviews
    parameters:
      - name: book_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: A list of reviews
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
                  review_id:
                    type: integer
                  content:
                    type: string
                  rating:
                    type: integer
            average_rating:
              type: number
     """
    cache_key = f"reviews:{book_id}"

    try:
        cached_data = r.get(cache_key)
        if cached_data:
            result = json.loads(cached_data)
            result["source"] = "cache"
            return jsonify(result)
    except Exception as e:
        print("Redis error (get):", str(e))

    # Fallback to DB if cache miss or Redis error
    reviews = Review.query.filter_by(book_id=book_id).all()
    data = [{"review_id": r.id, "content": r.content, "rating": r.rating} for r in reviews]
    avg_rating = sum([r['rating'] for r in data]) / len(data) if data else 0

    response = {
        "status": "success",
        "status_code": 200,
        "message": f"Found {len(data)} review(s)",
        "data": data,
        "average_rating": avg_rating
    }

    # Store to cache
    try:
        r.setex(cache_key, 60, json.dumps(response))  # TTL: 60 seconds
    except Exception as e:
        print("Redis error (set):", str(e))

    response["source"] = "db"
    return jsonify(response)
@reviews_bp.route('/books/<int:book_id>/reviews', methods=['POST'])
def add_review(book_id):
    """
    Add a review for a book
    ---
    tags:
      - Reviews
    parameters:
      - name: book_id
        in: path
        type: integer
        required: true
      - in: body
        name: review
        schema:
          type: object
          required:
            - content
            - rating
          properties:
            content:
              type: string
            rating:
              type: integer
    responses:
      201:
        description: Review added successfully
      400:
        description: Content or rating missing
    """
    data = request.get_json()
    content = data.get('content')
    rating = data.get('rating')

    if not content or rating is None:
        return jsonify({"status": "error", "status_code": 400, "message": "Content and Rating are required"}), 400

    review = Review(content=content, rating=rating, book_id=book_id)
    db.session.add(review)
    db.session.commit()

    return jsonify({
        "status": "success", "status_code": 201, "message": "Review added successfully",
        "data": {"review_id": review.id, "book_id": review.book_id, "content": review.content, "rating": review.rating}
    }), 201

