import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({ baseURL: 'http://localhost:8080/api' });

export default function RatingModal({ complaint, onClose, onRated }) {
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitRating = async () => {
    if (stars === 0) return toast.error('Please select a star rating');
    setSubmitting(true);
    try {
      await API.post(
        `/ratings/${complaint.id}?stars=${stars}&feedback=${encodeURIComponent(feedback)}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Thank you for your feedback!');
      onRated();
      onClose();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Already rated or error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'white', borderRadius: '16px', padding: '28px',
        width: '340px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>
        <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 500 }}>Rate Resolution</h3>
        <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#6b7280' }}>
          {complaint.title}
        </p>

        {/* Stars */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setStars(n)}
              style={{
                fontSize: '36px', border: 'none', background: 'none',
                cursor: 'pointer', transition: 'transform 0.1s',
                transform: (hovered || stars) >= n ? 'scale(1.2)' : 'scale(1)',
                filter: (hovered || stars) >= n ? 'none' : 'grayscale(1) opacity(0.4)'
              }}
            >
              ⭐
            </button>
          ))}
        </div>

        {/* Star label */}
        {(hovered || stars) > 0 && (
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#f59e0b', marginBottom: '12px', fontWeight: 500 }}>
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][(hovered || stars)]}
          </p>
        )}

        {/* Feedback */}
        <textarea
          placeholder="Optional: share your experience..."
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          rows={3}
          style={{
            width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px',
            padding: '10px', fontSize: '14px', resize: 'none',
            boxSizing: 'border-box', marginBottom: '16px'
          }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '10px', borderRadius: '8px',
            border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: '14px'
          }}>
            Cancel
          </button>
          <button onClick={submitRating} disabled={submitting} style={{
            flex: 1, padding: '10px', borderRadius: '8px',
            background: '#16a34a', color: 'white', border: 'none',
            cursor: 'pointer', fontSize: '14px', fontWeight: 500
          }}>
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
}