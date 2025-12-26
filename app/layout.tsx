import type { Metadata } from "next";

import "./globals.css";


import Navbar from "@/components/navbar"; 
import Footer from "@/components/Footer";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "GiveSpark", 
  description: "A modern Crowdfunding Platform built with Next.js and Prisma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      
      <body className={`antialiased`}> 
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark"
          enableSystem
        >
        <SessionProviderWrapper>

          <Navbar />
        
       
            <main>{children}</main>

          <Footer />

        </SessionProviderWrapper>
      </ThemeProvider>
      </body>
    </html>
  );
}
