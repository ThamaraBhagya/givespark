// components/SessionProviderWrapper.tsx
"use client";

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface SessionProviderWrapperProps {
    children: ReactNode;
}

// This component provides the session context to all children components
export default function SessionProviderWrapper({ children }: SessionProviderWrapperProps) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}