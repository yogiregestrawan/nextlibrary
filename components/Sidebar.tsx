// components/Sidebar.tsx
'use client';
import Link from 'next/link'; 
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
    const handleLogout = async () => {
    await supabase.auth.signOut(); // hapus sesi login
    router.push('/'); // redirect ke landing page
  };

  return (
    <aside className="w-64 bg-white shadow-md h-screen fixed top-0 left-0 z-40 px-4 py-6">
      <h1 className="text-xl font-bold text-[#4B4DED] mb-8">📚 Tee's Library</h1>
      <nav className="flex flex-col gap-4">
        <Link href="/books" className={pathname === '/books' ? 'text-orange-600 font-bold' : 'text-gray-800'}>🏠 Dashboard</Link>
        <Link href="/books/borrow" className={pathname === '/books/borrow' ? 'text-orange-600 font-bold' : 'text-gray-800'}>📚 Borrowed</Link>
        <Link href="/books/my-cart" className={pathname === '/books/my-cart' ? 'text-orange-600 font-bold' : 'text-gray-800'}>🛒 My Cart</Link>
        <Link href="/books/create" className={pathname === '/books/create' ? 'text-orange-600 font-bold' : 'text-gray-800'}>➕ Create Book</Link>
        <Link href="/books/update" className={pathname === '/books/update' ? 'text-orange-600 font-bold' : 'text-gray-800'}>🔄 Update Book</Link>
        
        <button onClick={handleLogout} className="text-left text-gray-800 hover:text-red-500">🔚 Logout</button>
      </nav>
    </aside>
  );
}
