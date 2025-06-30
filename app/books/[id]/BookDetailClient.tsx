"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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

function BookDetail(props: Book) {
  const [user, setUser] = useState<any>(null);
  const [successMsg] = useState("");
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState("/book-placeholder.png");

  useEffect(() => {
    if (props.cover_url) {
      const { data } = supabase.storage
        .from("books")
        .getPublicUrl(props.cover_url);
        setImageUrl(data?.publicUrl || "/book-placeholder.png");
    }
  }, [props.cover_url]);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    getUser();
  }, []);

  const handleDelete = async () => {
    if (!user) {
      alert("Anda belum login");
      return;
    }

    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus buku ini?");
    if (!confirmDelete) return;

    // ⛏️ Hapus buku dari tabel 'books'
    const { error } = await supabase.from("books").delete().eq("id", props.id);

    if (error) {
      console.error("Delete failed:", error.message);
      alert(`Gagal menghapus buku: ${error.message}`);
    } else {
      alert("Buku berhasil dihapus!");

      // ✅ Hapus juga cover-nya dari Supabase Storage jika ingin
      if (props.cover_url) {
        const { error: storageError } = await supabase.storage
          .from("books")
          .remove([props.cover_url]);

        if (storageError) {
          console.warn("Gagal menghapus cover dari storage:", storageError.message);
        }
      }

      // ✅ Arahkan balik ke dashboard dan paksa refresh
      router.push("/books");
      router.refresh();
    }
  };


  const renderStars = (rating: number | undefined) => {
    const safeRating = typeof rating === "number" && !isNaN(rating) ? rating : 0;
    const fullStars = Math.floor(safeRating);
    const halfStar = safeRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <span className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400">★</span>
        ))}
        {halfStar && <span className="text-yellow-400">☆</span>}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">☆</span>
        ))}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full flex flex-col md:flex-row gap-8">
      <div className="flex flex-col items-center gap-4">
        <img
          src={imageUrl}
          alt="Book Cover"
          className="w-48 h-64 object-cover rounded-lg mx-auto md:mx-0"
        />
        <button
          onClick={handleDelete}
          className="w-56 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete Buku
        </button>
        {successMsg && (
          <p className="text-green-600 text-sm font-semibold mt-2">{successMsg}</p>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{props.title}</h1>
          <h2 className="text-lg text-gray-600 mb-4">{props.author}</h2>
          <p className="mb-4 text-gray-700">{props.description}</p>
          <div className="flex items-center gap-2 mb-2">
            {renderStars(props.rating)}
            <span className="text-gray-500 text-sm">
              {typeof props.rating === "number" && !isNaN(props.rating)
                ? props.rating.toFixed(1)
                : "0.0"}
            </span>
          </div>
          <div className="text-xl font-bold text-[#ff805d] mb-4">
            {Number(props.price).toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
