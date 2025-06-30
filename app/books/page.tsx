"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  rating: number;
  price: number;
  image: string;
  cover_url: string;
}

export default function BooksListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);

    // ✅ Ambil sesi login user
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user) {
      console.warn("User belum login atau session kosong");
      setUser(null);
    } else {
      setUser(sessionData.session.user);
    }

    // ✅ Ambil daftar buku
    const { data: bookData, error: bookError } = await supabase.from("books").select("*");
    if (bookError) {
      console.error("Error fetching books:", bookError.message);
      setBooks([]);
      setLoading(false);
      return;
    }

    const booksWithImages = bookData.map((book: any) => {
      const { data: imageData } = supabase.storage
        .from("books")
        .getPublicUrl(book.cover_url);
      const publicUrl = imageData?.publicUrl ?? "/book-placeholder.png";

      return {
        ...book,
        image: publicUrl,
      };
    });

    setBooks(booksWithImages);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // ✅ Tambahkan listener saat kembali ke halaman
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchData(); // refetch data saat user kembali ke tab
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const handlePinjam = async (book: Book) => {
    if (!user) {
      alert("Anda belum login");
      return;
    }

    const returnDate = prompt("Masukkan tanggal pengembalian (YYYY-MM-DD):");
    if (!returnDate) {
      alert("Tanggal pengembalian dibatalkan.");
      return;
    }

    const { error } = await supabase.from("borrowings").insert({
      user_id: user.id,
      book_id: book.id,
      due_date: returnDate,
    });

    if (error) {
      console.error(error);
      alert("Gagal meminjam buku.");
    } else {
      alert("Buku berhasil dipinjam!");
      router.push("/books/borrow");
      router.refresh(); // ✅ agar dashboard refresh saat balik
    }
  };

  const handleBeli = async (book: Book) => {
    if (!user) {
      alert("Anda belum login");
      return;
    }

    const { error } = await supabase.from("cart").insert({
      user_id: user.id,
      book_id: book.id,
      price: book.price,
    });

    if (error) {
      console.error(error);
      alert("Gagal menambahkan ke cart.");
    } else {
      alert("Berhasil ditambahkan ke cart.");
      router.push("/books/my-cart");
      router.refresh(); // ✅ agar dashboard refresh saat balik
    }
  };

  return (
    <div className="flex min-h-screen bg-[#e6e4ff]">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-[#4B4DED] mb-8">Popular</h1>

        {loading ? (
          <div>Loading...</div>
        ) : books.length === 0 ? (
          <div>No books found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-between"
              >
                <img
                  src={book.image || "/book-placeholder.png"}
                  alt={book.title}
                  className="w-40 h-56 object-cover rounded mb-4"
                />
                <h2 className="text-xl font-bold mb-1 text-center">
                  {book.title}
                </h2>
                <h3 className="text-sm text-gray-600 mb-1">{book.author}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 text-center mb-2">
                  {book.description}
                </p>
                <div className="text-[#ff805d] font-bold mb-2">
                  Rp {Number(book.price).toLocaleString("id-ID")}
                </div>
                <div className="flex flex-col w-full gap-2">
                  <button
                    onClick={() => handlePinjam(book)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Pinjam Buku
                  </button>
                  <button
                    onClick={() => handleBeli(book)}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                  >
                    Beli Buku
                  </button>
                  <a
                    href={`/books/${book.id}`}
                    className="w-full bg-[#4B4DED] hover:bg-[#3a3ac9] text-white text-center py-2 px-4 rounded"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
