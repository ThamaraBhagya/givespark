// app/dashboard/creator/layout.tsx (Conceptual Guard Logic)
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation';
// Assume you import your authOptions from the nextauth handler
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 
import Sidebar from './Sidebar'; // Assume this component is created

export default async function CreatorLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    // 1. Check Authentication
    if (!session) {
        redirect('/auth/signin');
    }

    // 2. Check Role (Crucial security step)
    if (session.user.role !== 'CREATOR') {
        // Redirect non-creators away or show an access denied page
        redirect('/'); 
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar user={session.user} /> 
            <main className="flex-1 p-8 bg-gray-50">
                {children}
            </main>
        </div>
    );
}