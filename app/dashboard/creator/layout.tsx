import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation';

import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 
import DashboardClient from './DashboardClient';

export default async function CreatorLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/auth/signin');
    }

    
    if (session.user.role !== 'CREATOR') {
        
        redirect('/'); 
    }

    return (
        <DashboardClient user={session.user}>
            {children}
        </DashboardClient>
    );
}