"use client";

import { useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';

// Define the shape of our testimonial data
interface TestimonialData {
  id: string;
  content: string;
  rating: number;
  author: {
    name: string;
    image: string | null;
    role: string;
  };
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data);
        }
      } catch (error) {
        console.error("Failed to load testimonials", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 py-24 text-center">
        <div className="animate-pulse text-gray-400">Loading community stories...</div>
      </div>
    );
  }

  // If there are no testimonials yet, we can hide the section or show a placeholder
  if (testimonials.length === 0) return null;

  return (
    <div className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
            What Our Users Say
          </h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight">
            Trusted by Creators and Donors Alike
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div 
              key={t.id} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between transition-hover hover:shadow-md"
            >
              <div>
                {/* 💡 Dynamic Star Rating */}
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-5 w-5 ${
                        star <= t.rating ? 'text-yellow-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Content */}
                <p className="text-gray-600 italic leading-relaxed">
                  "{t.content}"
                </p>
              </div>

              {/* Author Details */}
              <div className="mt-8 flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden border border-gray-200">
                  {t.author.image ? (
                    <img src={t.author.image} alt={t.author.name} className="h-full w-full object-cover" />
                  ) : (
                    t.author.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-bold text-gray-900">{t.author.name}</p>
                  <p className="text-xs text-indigo-600 font-medium">
                    {t.author.role === 'CREATOR' ? 'Campaign Creator' : 'Community Supporter'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}