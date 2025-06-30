"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BorrowPage() {
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);
  const [returnedBooks, setReturnedBooks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error || !sessionData?.session?.user) {
        console.warn("User belum login.");
        return;
      }
      const currentUser = sessionData.session.user;
      setUser(currentUser);
      await fetchBooks(currentUser.id);
    };

    checkSession();
  }, []);

  const fetchBooks = async (userId: string) => {
    // Ambil buku yang sedang dipinjam
    const { data: borrowData } = await supabase
      .from("borrowings")
      .select("*, books:books(*)")
      .eq("user_id", userId)
      .is("returned_at", null);

    if (borrowData) {
      const borrowedWithImages = await Promise.all(
        borrowData.map(async (entry: any) => {
          const { data } = supabase.storage
            .from("books")
            .getPublicUrl(entry.books?.cover_url);

          return {
            id: entry.id,
            book_id: entry.book_id,
            title: entry.books?.title,
            author: entry.books?.author,
            due_date: entry.due_date,
            image: data?.publicUrl || "/book-placeholder.png",
          };
        })
      );
      setBorrowedBooks(borrowedWithImages);
    }

    // Ambil buku yang sudah dikembalikan
    const { data: returnedData } = await supabase
      .from("returned_books")
      .select("*, books:books(*)")
      .eq("user_id", userId);

    if (returnedData) {
      const returnedWithImages = await Promise.all(
        returnedData.map(async (entry: any) => {
          const { data } = supabase.storage
            .from("books")
            .getPublicUrl(entry.books?.cover_url);

          return {
            title: entry.books?.title,
            author: entry.books?.author,
            returned_at: entry.returned_at,
            image: data?.publicUrl || "/book-placeholder.png",
          };
        })
      );
      setReturnedBooks(returnedWithImages);
    }
  };

  const handleKembalikan = async (borrowId: string, bookId: string) => {
    if (!user) return;

    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("borrowings")
      .update({ returned_at: now })
      .eq("id", borrowId)
      .eq("user_id", user.id)
      .is("returned_at", null);

    if (updateError) {
      alert("Gagal mengembalikan buku.");
      return;
    }

    const { error: insertError } = await supabase.from("returned_books").insert({
      user_id: user.id,
      book_id: bookId,
      returned_at: now,
    });

    if (!insertError) {
      alert("Buku berhasil dikembalikan!");

      setBorrowedBooks((prev) => prev.filter((book) => book.id !== borrowId));

      const returnedBook = borrowedBooks.find((book) => book.id === borrowId);
      if (returnedBook) {
        setReturnedBooks((prev) => [
          ...prev,
          {
            ...returnedBook,
            returned_at: now,
          },
        ]);
      }
    } else {
      alert("Gagal menyimpan data pengembalian.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#e6e4ff]">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-[#404249] mb-8">Books Being Borrowed</h1>
        {borrowedBooks.length === 0 ? (
          <p className="text-gray-600">Tidak ada buku yang sedang dipinjam.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {borrowedBooks.map((book) => (
              <div
                key={book.book_id}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center"
              >
                <img src={book.image} className="w-40 h-56 object-cover rounded mb-4" />
                <h2 className="text-xl font-bold mb-1 text-center">{book.title}</h2>
                <h3 className="text-sm text-gray-600 mb-1">{book.author}</h3>
                <p className="text-blue-500 text-sm mb-2">
                  Kembali sebelum: {new Date(book.due_date).toLocaleDateString("id-ID")}
                </p>
                <button
                  onClick={() => handleKembalikan(book.id, book.book_id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                >
                  Kembalikan Buku
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#404249] mb-4">Returned Books</h2>
          {returnedBooks.length === 0 ? (
            <p className="text-gray-600">Belum ada buku yang dikembalikan.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {returnedBooks.map((book, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center"
                >
                  <img src={book.image} className="w-40 h-56 object-cover rounded mb-4" />
                  <h2 className="text-xl font-bold mb-1 text-center">{book.title}</h2>
                  <h3 className="text-sm text-gray-600 mb-1">{book.author}</h3>
                  <p className="text-green-600 text-sm">
                    Dikembalikan pada: {new Date(book.returned_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
