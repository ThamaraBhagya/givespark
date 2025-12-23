"use client"; // 💡 Required for useSession and state

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Twitter, Linkedin, Github, MessageSquare, X } from 'lucide-react';
import LeaveTestimonial from './LeaveTestimonial';

const footerNavigation = {
  solutions: [
    { name: 'Launch Campaign', href: '/campaign/new' },
    { name: 'Explore Projects', href: '/campaign/list' }, // Fixed typo from 'campaigns'
    { name: 'How It Works', href: '/#how-it-works' },
  ],
  company: [
    { name: 'About GiveSpark', href: '/#about' },
    { name: 'Testimonials', href: '/#testimonials' },
    { name: 'Contact', href: '#' },
  ],
  legal: [
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
  ],
};

export default function Footer() {
  const { data: session } = useSession(); // 💡 Check login status
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Section 1: Logo and Newsletter */}
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="text-2xl font-extrabold text-white">
                ⚡ GiveSpark
            </Link>
            
            <p className="text-gray-400 text-base">
              Join our community and get updates on inspiring projects.
            </p>
            
            {/* Newsletter */}
            <form className="mt-4 sm:flex sm:max-w-md">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full min-w-0 appearance-none rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-teal-500 px-4 py-2 text-base font-medium text-white hover:bg-teal-600 focus:outline-none"
                >
                  Subscribe
                </button>
              </div>
            </form>

            {/* 💡 TESTIMONIAL BUTTON: Only visible if logged in */}
            {session && (
              <div className="pt-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-2 bg-gray-800 border border-gray-700 hover:border-teal-500 text-teal-400 hover:text-white px-4 py-2 rounded-lg transition-all text-sm font-semibold"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Share your experience</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 2 & 3: Navigation Links */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Solutions</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerNavigation.solutions.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-base text-gray-400 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-base text-gray-400 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Legal</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-base text-gray-400 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-800 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-white"><Twitter className="h-6 w-6" /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Linkedin className="h-6 w-6" /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Github className="h-6 w-6" /></a>
          </div>
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} GiveSpark, Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* 💡 TESTIMONIAL MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg">
            {/* Close Icon */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-teal-400 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            {/* Form Container */}
            <div className="bg-white rounded-2xl overflow-hidden">
               <LeaveTestimonial />
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}