"use client";

import { QueryClient, QueryClientProvider } from 'react-query';
import './globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';

const queryClient = new QueryClient();

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <header className="bg-gray-800 p-4">
            <nav className="container mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/OLX_blue_logo.svg/2560px-OLX_blue_logo.svg.png" 
                  alt="Logo" 
                  className="h-10"
                />
              </div>
              <div className="flex space-x-4">
                <Link href="/" className="text-white text-lg font-semibold bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
                  Product List
                </Link>
                <Link href="/create" className="text-white text-lg font-semibold bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition duration-200">
                  Create Product
                </Link>
              </div>
            </nav>
          </header>
          <main>{children}</main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
