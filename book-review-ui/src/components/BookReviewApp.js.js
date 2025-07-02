import React, { useState, useEffect } from 'react';
import { Plus, Star, Book, MessageSquare, Search } from 'lucide-react';

const API_BASE = 'http://localhost:5000';

const BookReviewApp = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('books');
  const [showReviewForm, setShowReviewForm] = useState(false);


  const [newBook, setNewBook] = useState({ title: '', author: '' });
  const [newReview, setNewReview] = useState({ content: '', rating: 5 });

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE}/books`);
      const data = await response.json();
      if (data.status === 'success') {
        setBooks(data.data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchReviews = async (bookId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/books/${bookId}/reviews`);
      const data = await response.json();
      if (data.status === 'success') {
        setReviews(data.data);
        setAverageRating(data.average_rating || 0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async () => {
    if (!newBook.title || !newBook.author) return;

    try {
      const response = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      });

      if (response.ok) {
        setNewBook({ title: '', author: '' });
        fetchBooks();
        setActiveTab('books');
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const addReview = async () => {
    if (!newReview.content || !selectedBook) return;

    try {
      const response = await fetch(`${API_BASE}/books/${selectedBook.book_id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });

      if (response.ok) {
        setNewReview({ content: '', rating: 5 });
        fetchReviews(selectedBook.book_id);
      }
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const selectBook = (book) => {
    setSelectedBook(book);
    setActiveTab('reviews');
    fetchReviews(book.book_id);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const StarRating = ({ rating, size = 20 }) => (
    <div style={{ display: 'flex' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          style={{ color: star <= rating ? '#FACC15' : '#D1D5DB', marginRight: 4 }}
        />
      ))}
    </div>
  );

  const tabButtonStyle = (tab) => ({
    padding: '10px 16px',
    borderRadius: '6px',
    fontWeight: '500',
    backgroundColor: activeTab === tab ? '#3B82F6' : 'transparent',
    color: activeTab === tab ? 'white' : '#4B5563',
    margin: '4px',
    border: '1px solid #E5E7EB',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
    transition: 'all 0.3s ease'
  });

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #D1D5DB',
    fontSize: '1rem',
    marginBottom: '1rem',
    outline: 'none',
    transition: 'border 0.2s ease',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '4px',
    fontWeight: '500',
    color: '#374151'
  };

  const sectionStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '24px'
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #EFF6FF, #E0E7FF)', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>📚 Book Review Service</h1>
          <p style={{ color: '#6B7280' }}>Discover, review, and share your favorite books</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {['books', 'add-book', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={tabButtonStyle(tab)}
            >
              {tab === 'books' && <><Book size={16} style={{ marginRight: 6 }} />Books</>}
              {tab === 'add-book' && <><Plus size={16} style={{ marginRight: 6 }} />Add Book</>}
              {tab === 'reviews' && <><MessageSquare size={16} style={{ marginRight: 6 }} />Reviews</>}
            </button>
          ))}
        </div>

       {activeTab === 'books' && books.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {books.map((book) => (
              <div
                key={book.book_id}
                onClick={() => selectBook(book)}
                style={{ ...sectionStyle, borderLeft: '4px solid #3B82F6', cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>{book.book_title}</h3>
                <p style={{ color: '#6B7280', marginBottom: '1rem' }}>by {book.book_author}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: '#3B82F6', fontWeight: '500' }}>Click to view reviews</span>
                  <Search size={16} style={{ color: '#9CA3AF' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'books' && books.length === 0 && (
          <div style={{ textAlign: 'center', color: '#6B7280', marginTop: '40px' }}>
            <Book size={48} style={{ marginBottom: '12px', color: '#9CA3AF' }} />
            <p>No books available. Please add a new book.</p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            {!selectedBook ? (
              <div>
                <Book size={48} style={{ color: '#9CA3AF', marginBottom: '12px' }} />
                <p style={{ color: '#6B7280' }}>Please select a book to view its reviews.</p>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937' }}>{selectedBook.book_title}</h2>
                <p style={{ marginBottom: '1rem', color: '#6B7280' }}>by {selectedBook.book_author}</p>

                <div style={{ margin: '20px auto', maxWidth: '400px' }}>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    style={{ width: '100%', backgroundColor: '#3B82F6', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: '500', cursor: 'pointer', fontSize: '1rem', marginBottom: '16px' }}
                  >
                    {showReviewForm ? 'Hide Review Form' : 'Add Review'}
                  </button>

                  {showReviewForm && (
                    <div style={sectionStyle}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>Write a Review</h3>
                      <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>Rating</label>
                      <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                        style={{ ...inputStyle, marginBottom: '1rem' }}
                      >
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <option key={rating} value={rating}>
                            {rating} Star{rating > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>

                      <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>Review</label>
                      <textarea
                        value={newReview.content}
                        onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                        style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
                        placeholder="Write your review here..."
                      ></textarea>

                      <button
                        onClick={addReview}
                        style={{ width: '100%', backgroundColor: '#10B981', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: '500', cursor: 'pointer', marginTop: '1rem', fontSize: '1rem' }}
                      >
                        Submit Review
                      </button>
                    </div>
                  )}
                </div>

                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.review_id} style={{ ...sectionStyle, textAlign: 'left' }}>
                      <StarRating rating={review.rating} size={16} />
                      <p style={{ color: '#374151', marginTop: '10px' }}>{review.content}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#9CA3AF' }}>No reviews yet.</p>
                )}
              </div>
            )}
          </div>
        )}
        {activeTab === 'add-book' && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={sectionStyle}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '1.5rem', textAlign: 'center' }}>Add New Book</h2>
              <div>
                <label style={labelStyle}>Book Title</label>
                <input
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  style={inputStyle}
                  placeholder="Enter book title"
                />

                <label style={labelStyle}>Author</label>
                <input
                  type="text"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  style={inputStyle}
                  placeholder="Enter author name"
                />

                <button
                  onClick={addBook}
                  style={{ width: '100%', backgroundColor: '#3B82F6', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: '500', cursor: 'pointer', marginTop: '1rem', fontSize: '1rem' }}
                >
                  Add Book
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookReviewApp;

