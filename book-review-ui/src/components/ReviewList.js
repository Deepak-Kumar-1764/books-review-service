import React, { useEffect, useState } from 'react';
import api from '../api';

function ReviewList({ bookId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get(`/books/${bookId}/reviews`)
      .then(res => setReviews(res.data.data))
      .catch(err => console.error(err));
  }, [bookId]);

  return (
    <div style={{ paddingLeft: 20 }}>
      <h4>💬 Reviews</h4>
      {reviews.length === 0 ? <p>No reviews yet.</p> : (
        <ul>
          {reviews.map(r => (
            <li key={r.review_id}>⭐ {r.rating}: {r.content}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReviewList;
