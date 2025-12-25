'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { UserCircleIcon,LogOut } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  
  // Define the main navigation links
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Campaigns', href: '/campaign/list' },
    { name: 'About', href: '/#about' },
    { name: 'How It Works', href: '/#how-it-works' },
  ];

  const isAuthenticated = status === 'authenticated';
  const isCreator = isAuthenticated && session?.user?.role === 'CREATOR';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Name (Top Left) */}
          <div className="shrink-0 flex items-center space-x-2">
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
            {/* Start a Campaign Button */}
            <Link 
              href={isCreator ? "/campaign/new" : "/auth/signin"} 
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Start a Campaign
            </Link>
            
            {/* Conditional Login/User Status */}
            {status === 'loading' ? (
              <div className="animate-pulse h-8 w-8 bg-gray-200 rounded-full" />
            ) : isAuthenticated ? (
              // FIX: Wrapped authenticated content in a single fragment or div
              <div className="flex items-center space-x-4 border-r pr-4 mr-2 border-gray-200">
                {/* PROFILE IMAGE & NAME */}
                <Link 
                  href={isCreator ? "/dashboard/creator" : "/dashboard/user"} 
                  className="flex items-center space-x-2 group cursor-pointer"
                  title="View Dashboard"
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-indigo-100 bg-gray-100">
                    {session?.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="h-full w-full text-gray-400" />
                    )}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-gray-900 leading-none">
                      {session?.user?.name?.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
                      {session?.user?.role}
                    </p>
                  </div>
                </Link>

                <button 
                  onClick={() => signOut({ callbackUrl: '/' })} 
                  className="text-gray-600 hover:text-red-600 text-sm font-medium px-3 py-2 rounded-md"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div> // FIX: Closed the outer container div
            ) : (
              <Link 
                href="/auth/signin" 
                className="text-gray-600 hover:text-indigo-600 text-sm font-medium px-3 py-2 rounded-md"
              >
                Login
              </Link>
            )}

            
          </div>
        </div>
      </div>
    </nav>
  );
}