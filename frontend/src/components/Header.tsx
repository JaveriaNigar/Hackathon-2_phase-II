'use client';

import { getToken } from '@/lib/auth';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/services/auth';
import { useEffect, useState } from 'react';

const Header = () => {
  const [token, setToken] = useState<string | null>(null);
  const pathname = usePathname();
  const isDashboardPage = pathname === '/dashboard';

  useEffect(() => {
    // Only run on the client side
    setToken(getToken());
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout service to remove the token
    } finally {
      window.location.href = '/login'; // Redirect to login after logout
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-brown-accent font-lexend">
          Todo App
        </Link>
        <nav>
          {token && isDashboardPage ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="btn-brown-gradient px-8 py-4 text-lg rounded-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              {!token && (
                <>
                  <Link href="/login" className="text-black hover:text-brown-accent">
                    Login
                  </Link>
                  <Link href="/signup" className="text-black hover:text-brown-accent">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;