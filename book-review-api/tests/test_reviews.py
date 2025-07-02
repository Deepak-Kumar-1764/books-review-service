import pytest
from app import create_app, db
from app.models import Book, Review

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///:memory:"
    
    with app.app_context():
        db.create_all()
        book = Book(title="Test Book", author="Test Author")
        db.session.add(book)
        db.session.commit()
    
    with app.test_client() as client:
        yield client

def test_add_review(client):
    app = create_app()
    with app.app_context():
        book = Book.query.first()

    review_data = {"content": "Great book!", "rating": 5}
    response = client.post(f"/books/{book.id}/reviews", json=review_data)
    assert response.status_code == 201
    assert response.get_json()["data"]["content"] == "Great book!"

def test_get_reviews(client):
    app = create_app()
    with app.app_context():
        book = Book.query.first()

    response = client.get(f"/books/{book.id}/reviews")
    assert response.status_code == 200
    assert "data" in response.get_json()

