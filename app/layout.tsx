import type { Metadata } from "next";

import "./globals.css";


import Navbar from "@/components/navbar"; 
import Footer from "@/components/Footer";

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
    <html lang="en">
      
      <body className={`antialiased`}> 
        
        
        <Navbar />
        
       
        <main>{children}</main>

        <Footer />

        
        
      </body>
    </html>
  );
}
