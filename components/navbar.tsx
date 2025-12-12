// components/Navbar.tsx
'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();
  // Define the main navigation links
  const navLinks = [
    { name: 'Campaigns', href: '' }, // The main list page
    { name: 'About', href: '/#about' },              // Anchor link for About section
    { name: 'How It Works', href: '/#how-it-works' },// Anchor link for How It Works section
  ];

  const isAuthenticated = status === 'authenticated';
  const isCreator = isAuthenticated && session?.user?.role === 'CREATOR';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Name (Top Left) */}
          <div className="shrink-0 flex items-center space-x-2">
            {/* Placeholder for Icon (e.g., a Spark or Fire icon) */}
            <span className="text-3xl text-indigo-600">⚡</span> 
            
            <Link href="/" className="text-xl font-extrabold text-gray-800">
              GiveSpark
            </Link>
          </div>

          {/* Navigation Links (Center) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:bg-gray-50 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Buttons (Top Right) */}
          <div className="flex items-center space-x-4">
            
            {/* Conditional Login/User Status */}
            {status === 'loading' ? (
              <div className="text-gray-600 text-sm">Loading...</div>
            ) : isAuthenticated ? (
              <>
                {/* 📌 FIX: CREATOR DASHBOARD LINK */}
                {isCreator && (
                  <Link 
                    href="/dashboard/creator" 
                    className="text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded-md text-sm font-medium"
                  >
                    Creator Dashboard
                  </Link>
                )}

                {/* 📌 FIX: We now show the Logout button for ALL logged-in users */}
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })} 
                  className="text-gray-600 hover:text-red-600 text-sm font-medium px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              // If not authenticated, show Login
              <Link 
                href="/auth/signin" 
                className="text-gray-600 hover:text-indigo-600 text-sm font-medium px-3 py-2 rounded-md"
              >
                Login
              </Link>
            )}

            {/* Start a Campaign Button: 
                Creator -> /campaign/new
                Others -> /auth/signin 
            */}
            <Link 
              href={isCreator ? "/campaign/new" : "/auth/signin"} 
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Start a Campaign
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}