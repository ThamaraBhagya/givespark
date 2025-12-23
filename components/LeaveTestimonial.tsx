"use client";

import { useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';

export default function LeaveTestimonial() {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5); // Default to 5 stars
  const [hover, setHover] = useState(0);   // Track hover state for stars
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, rating }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to submit testimonial');

      setStatus({ type: 'success', message: 'Thank you! Your testimonial has been posted.' });
      setContent('');
      setRating(5);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Share Your Story</h3>
        <p className="text-gray-500 text-sm mt-1">How has GiveSpark helped you realize your goals?</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating Interaction */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none transform transition hover:scale-110 active:scale-95"
              >
                <StarIcon
                  className={`h-10 w-10 transition-colors ${
                    (hover || rating) >= star ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                />
              </button>
            ))}
            <span className="ml-3 text-sm font-bold text-gray-400">({rating}/5)</span>
          </div>
        </div>

        {/* Feedback Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
            Your Feedback
          </label>
          <textarea
            id="content"
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a few sentences about your experience..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || content.length < 10}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 transition-all active:transform active:scale-[0.98]"
        >
          {loading ? 'Posting...' : 'Post Testimonial'}
        </button>

        {/* Status Messages */}
        {status.type && (
          <div className={`p-4 rounded-lg text-center text-sm font-medium ${
            status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
}