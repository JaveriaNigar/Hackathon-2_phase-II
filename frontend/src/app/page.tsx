// frontend/src/app/page.tsx
import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-brown-light">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
            Welcome to <span className="text-brown-accent">Todo App</span>
          </h1>

          <p className="text-xl text-black mb-10 max-w-2xl mx-auto">
            Keep your tasks in order and your day on track. <br />
            Focus on what matters and get things done efficiently.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <button className="btn-brown-gradient px-8 py-4 text-lg w-full sm:w-auto rounded-lg">
                Get Started
              </button>
            </Link>

            <Link href="/login">
              <button className="btn-brown-gradient px-8 py-4 text-lg w-full sm:w-auto rounded-lg">
                Login
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white border border-brown-accent rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-brown-accent mb-3">Organize Tasks</h3>
            <p className="text-black">
              Create, update, and manage your tasks with our intuitive interface designed for productivity.
            </p>
          </div>

          <div className="bg-white border border-brown-accent rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-brown-accent mb-3">Track Progress</h3>
            <p className="text-black">
              Monitor your daily and weekly progress at a glance to stay efficient and focused on what matters most.
            </p>
          </div>

          <div className="bg-white border border-brown-accent rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-brown-accent mb-3">Secure Access</h3>
            <p className="text-black">
              Your tasks are protected with secure authentication and user isolation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
