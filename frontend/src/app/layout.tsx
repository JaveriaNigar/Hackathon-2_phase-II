// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Lexend } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';
import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';

const lexend = Lexend({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-lexend",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App - Brown Theme",
  description: "A beautiful todo app with brown-white theme",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lexend.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen bg-white">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="bg-brown-light border-t border-brown-border py-4">
      <div className="container mx-auto px-4 text-center text-black">
        <p>© {new Date().getFullYear()} Todo App. All rights reserved.</p>
      </div>
    </footer>
  );
}