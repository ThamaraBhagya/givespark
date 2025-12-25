"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Twitter, Linkedin, Github, MessageSquare, X, Send } from 'lucide-react';
import LeaveTestimonial from './LeaveTestimonial';

const footerNavigation = {
  solutions: [
    { name: 'Launch Campaign', href: '/campaign/new' },
    { name: 'Explore Projects', href: '/campaign/list' },
    { name: 'How It Works', href: '/#how-it-works' },
  ],
  company: [
    { name: 'About GiveSpark', href: '/#about' },
    { name: 'Testimonials', href: '/#testimonials' },
    { name: 'Success Stories', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
};

export default function Footer() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="bg-[#050811] border-t border-white/5 relative overflow-hidden">
      {/* Subtle Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8 relative z-10">
        <div className="xl:grid xl:grid-cols-4 xl:gap-12">
          
          {/* Brand & Newsletter Section */}
          <div className="space-y-8 xl:col-span-2">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative h-8 w-8">
                <Image src="/logo.png" alt="Icon" fill className="object-contain" />
              </div>
              <div className="relative h-6 w-32">
                <Image src="/givespark.png" alt="GiveSpark" fill className="object-contain brightness-0 invert" />
              </div>
            </Link>
            
            <p className="text-gray-400 text-lg max-w-sm font-light">
              Join our global community of visionaries and backers. Stay updated on projects that ignite change.
            </p>
            
            <form className="max-w-md">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 p-2 bg-teal-500 text-gray-950 rounded-xl hover:bg-teal-400 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>

            {session && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center space-x-3 px-6 py-3 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all duration-300"
              >
                <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="font-bold">Share Your Success Story</span>
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 xl:mt-0 xl:col-span-2">
            <div>
              <h3 className="text-sm font-black text-white tracking-[0.2em] uppercase mb-6">Solutions</h3>
              <ul className="space-y-4">
                {footerNavigation.solutions.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-gray-400 hover:text-teal-400 transition-colors font-light">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-[0.2em] uppercase mb-6">Company</h3>
              <ul className="space-y-4">
                {footerNavigation.company.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-gray-400 hover:text-teal-400 transition-colors font-light">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-sm font-black text-white tracking-[0.2em] uppercase mb-6">Legal</h3>
              <ul className="space-y-4">
                {footerNavigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-gray-400 hover:text-teal-400 transition-colors font-light">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Socials & Copyright */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-gray-500 text-sm font-light order-2 md:order-1">
            &copy; {new Date().getFullYear()} GiveSpark, Inc. Built for impact.
          </p>
          <div className="flex items-center space-x-6 order-1 md:order-2">
            {[Twitter, Linkedin, Github].map((Icon, idx) => (
              <a key={idx} href="#" className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Modal logic remains the same... */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-14 right-0 p-2 text-white/50 hover:text-white bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
               <LeaveTestimonial />
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}