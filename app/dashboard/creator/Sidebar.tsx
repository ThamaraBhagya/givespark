// app/dashboard/creator/Sidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // For active link styling
import { LayoutDashboard, Wallet, Megaphone, User } from 'lucide-react'; // Example icons

// Define the expected user data structure
interface SidebarProps {
  user: {
    name: string;
    role: 'USER' | 'CREATOR';
    // Add other user fields if needed (e.g., image)
  };
}

const navItems = [
  // { 
  //   name: 'Dashboard Home', 
  //   href: '/dashboard/creator', 
  //   icon: LayoutDashboard 
  // },
  { 
    name: 'Virtual Wallet', 
    href: '/dashboard/creator/wallet', 
    icon: Wallet 
  },
  { 
    name: 'My Campaigns', 
    href: '/dashboard/creator/campaigns', 
    icon: Megaphone 
  },
];

export default function Sidebar({ user }: SidebarProps) {
  // Use 'use client' hook to use hooks like usePathname
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col h-screen sticky top-0">
      
      {/* Header/Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <Link href="/" className="text-xl font-extrabold text-teal-400">
          GiveSpark Creator
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <User className="w-6 h-6 p-1 rounded-full bg-indigo-600 text-white" />
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-xs text-teal-400">Role: {user.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 p-2 rounded-md transition duration-150 ease-in-out
                ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* CTA: Create New Campaign (Always visible) */}
      <div className="p-4 border-t border-gray-700">
        <Link
          href="/campaign/new"
          className="block w-full text-center py-2 bg-teal-500 text-gray-900 font-bold rounded-md hover:bg-teal-400 transition"
        >
          + Launch New Campaign
        </Link>
      </div>
    </aside>
  );
}