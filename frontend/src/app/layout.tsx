// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from '@/components/Header';
import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';

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
        className="antialiased"
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