"use client";

import { useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';

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

  if (loading) return (
    <div className="bg-white dark:bg-[#0a0f1d] py-24 text-center">
      <div className="animate-pulse text-slate-500 dark:text-gray-500 font-mono text-sm tracking-widest uppercase">Reading Community Stories...</div>
    </div>
  );

  if (testimonials.length === 0) return null;

  return (
    <section className="relative bg-white dark:bg-[#0a0f1d] py-24 overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-black text-teal-600 dark:text-teal-400 tracking-[0.3em] uppercase mb-4">Social Proof</h2>
          <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Trusted by <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600 dark:from-teal-400 dark:to-indigo-400">Thousands</span> of Visionaries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div 
              key={t.id} 
              className="group relative bg-indigo-50/50 dark:bg-white/[0.03] border border-indigo-200 dark:border-white/10 p-8 rounded-3xl backdrop-blur-xl transition-all duration-500 hover:bg-indigo-100/70 dark:hover:bg-white/[0.06] hover:-translate-y-2"
            >
              
              <div className="flex mb-6 space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-4 w-4 ${star <= t.rating ? 'text-indigo-600 dark:text-teal-400' : 'text-indigo-200 dark:text-gray-700'}`}
                  />
                ))}
              </div>

              <p className="text-slate-700 dark:text-gray-300 leading-relaxed font-light italic mb-8">
                "{t.content}"
              </p>

              <div className="flex items-center pt-6 border-t border-indigo-200 dark:border-white/5">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 p-[1px] overflow-hidden">
                  <div className="h-full w-full rounded-full bg-white dark:bg-[#0a0f1d] flex items-center justify-center overflow-hidden">
                    {t.author.image ? (
                      <img src={t.author.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-slate-900 dark:text-white font-bold">{t.author.name.charAt(0)}</span>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{t.author.name}</p>
                  <p className="text-[10px] font-black text-indigo-600 dark:text-teal-500 uppercase tracking-widest mt-1">
                    {t.author.role === 'CREATOR' ? 'Project Lead' : 'Backer'}
                  </p>
                </div>
              </div>
              
              
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-indigo-600 to-teal-600 dark:from-teal-400 dark:to-indigo-500 transition-all duration-500 group-hover:w-full rounded-b-3xl"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}