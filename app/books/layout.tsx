// app/books/layout.tsx
import Sidebar from '@/components/Sidebar';
import React from 'react';

export default function BooksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 pl-64 p-8 bg-[#e6e4ff] min-h-screen">
        {children}
      </main>
    </div>
  );
}
