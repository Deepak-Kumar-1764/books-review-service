import pytest
from app import create_app, db
from app.models import Book

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///:memory:"
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client

def test_add_book(client):
    res = client.post('/books', json={'title': '1984', 'author': 'George Orwell'})
    assert res.status_code == 201
    assert res.get_json()['data']['book_title'] == '1984'

def test_get_books(client):
    client.post('/books', json={'title': 'Sapiens', 'author': 'Yuval Noah Harari'})
    res = client.get('/books')
    data = res.get_json()
    assert res.status_code == 200
    assert len(data['data']) >= 1

