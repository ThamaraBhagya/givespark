// app/dashboard/creator/layout.tsx (Conceptual Guard Logic)
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation';
// Assume you import your authOptions from the nextauth handler
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 
import DashboardClient from './DashboardClient';

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
        <DashboardClient user={session.user}>
            {children}
        </DashboardClient>
    );
}