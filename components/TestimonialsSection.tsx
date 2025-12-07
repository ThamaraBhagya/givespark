// components/TestimonialsSection.tsx
import { StarIcon } from '@heroicons/react/24/solid'; // Filled Star icon

const testimonials = [
  {
    quote: "GiveSpark made launching my education fund effortless. The process was smooth, and the virtual wallet feature gave me a clear view of my funds instantly. Highly recommended for any creator!",
    author: 'Sarah M.',
    title: 'Creator, "Future Scholars" Campaign',
    rating: 5,
    avatar: '/avatars/sarah.jpg',
  },
  {
    quote: "I love the clean interface and the real-time progress updates. Donating was so easy, and the mock receipt generation felt professional. I feel great supporting projects through this platform.",
    author: 'Alex P.',
    title: 'Donor and Backer',
    rating: 5,
    avatar: '/avatars/alex.jpg',
  },
  {
    quote: "The best part is how quickly I saw the virtual deposit hit my wallet after a large mock donation came in. The logic is solid, making it a fantastic demo for my portfolio!",
    author: 'David K.',
    title: 'Creator, "Tech Innovation" Campaign',
    rating: 4,
    avatar: '/avatars/david.jpg',
  },
];

// Helper component for star rating display
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${
          rating > i ? 'text-yellow-400' : 'text-gray-300'
        }`}
        aria-hidden="true"
      />
    ))}
  </div>
);


export default function TestimonialsSection() {
  return (
    // Set the anchor tag here for the Navbar link: href="#testimonials"
    <section id="testimonials" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">What Our Users Say</h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900">
            Trusted by Creators and Donors Alike
          </p>
        </div>

        {/* Testimonials Grid (3 columns) */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-8 rounded-xl shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Rating */}
                <StarRating rating={testimonial.rating} />

                {/* Quote */}
                <blockquote className="mt-6 text-lg text-gray-700 italic">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
              </div>

              {/* Author Info */}
              <div className="mt-6 flex items-center">
                {/* Placeholder for Avatar (You will need to create these mock files in /public/avatars) */}
                <div className="shrink-0 w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xl">
                    {testimonial.author.charAt(0)}
                </div>

                <div className="ml-4">
                  <p className="text-base font-bold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-indigo-600">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}