// /app/dashboard/creator/page.tsx
import { redirect } from 'next/navigation';

// This is a simple server component that immediately redirects
// the user to the default starting page for the dashboard (e.g., the Wallet page)

export default function CreatorDashboardRootPage() {
    // Redirect the user to the Wallet page, which is typically the central hub
    redirect('/dashboard/creator/wallet');
}