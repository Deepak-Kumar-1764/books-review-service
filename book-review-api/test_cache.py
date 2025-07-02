import pytest
from unittest.mock import patch
from app import create_app, db
from app.models import Book
import json

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///:memory:"
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            book = Book(title="Invisible Man", author="Ralph Ellison")
            db.session.add(book)
            db.session.commit()
        yield client

def test_cache_miss(client):
    with patch('app.redis_client.r.get', return_value=None), 
         patch('app.redis_client.r.set') as mock_set:
    response = client.get('/books')
    assert response.status_code == 200
    assert mock_set.called  #  Cache set was called after miss

