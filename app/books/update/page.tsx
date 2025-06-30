"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Book {
  id: string;
  title: string;
}

export default function UpdateBookPage() {
  const supabase = createClientComponentClient();
  const session = useSession();
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    rating: 0,
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("/book-placeholder.png");

  const userId = session?.user?.id;

  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await supabase.from("books").select("id, title");
      if (data) setBooks(data);
    };

    fetchBooks();
  }, [supabase]);

  const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedId(id);

    const { data } = await supabase.from("books").select("*").eq("id", id).single();
    if (data) {
      setForm({
        title: data.title,
        author: data.author,
        description: data.description,
        price: data.price.toString(),
        rating: data.rating,
      });

      const { data: imageData } = supabase.storage
        .from("books")
        .getPublicUrl(data.cover_url);
      setCoverPreview(imageData?.publicUrl || "/book-placeholder.png");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRating = (index: number) => {
    setForm({ ...form, rating: index + 1 });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
      setCoverPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("Anda belum login. Tidak bisa update buku.");
      return;
    }

    let fileName = "";
    if (coverFile) {
      fileName = `${Date.now()}_${coverFile.name}`.replace(/\s+/g, "_");

      const { error: uploadError } = await supabase.storage
        .from("books")
        .upload(fileName, coverFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: coverFile.type,
        });

      if (uploadError) {
        console.error(uploadError);
        return alert("Gagal mengunggah gambar cover.");
      }
    }

    const updateData: Record<string, any> = {
      title: form.title,
      author: form.author,
      description: form.description,
      price: Number(form.price),
      rating: form.rating,
      user_id: userId, // tambahkan user_id agar bisa dimiliki
    };

    if (fileName) {
      updateData.cover_url = fileName;
    }

      const { data, error, status } = await supabase
        .from("books")
        .update(updateData)
        .eq("id", selectedId)

      console.log("UPDATE DATA:", updateData);
      console.log("status:", status);
      console.log("SELECTED ID:", selectedId);
      console.log("RESULT:", data);
      console.log("ERROR:", error);
      console.log("userId", userId);


    if (error) {
      console.error("Gagal update:", error);
      return alert("Gagal memperbarui buku.");
    }

    alert("Buku berhasil diperbarui!");
    router.push("/books");
    router.refresh();
  };

  if (session === null) {
    return <div className="p-8">⏳ Memuat sesi login...</div>;
  }

  if (!userId) {
    return <div className="p-8 text-red-500">❌ Anda belum login. Silakan login terlebih dahulu.</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f5f7fc] p-10 gap-10">
      <div className="flex-1 max-w-xl">
        <h1 className="text-3xl font-bold text-[#4B4DED] mb-6">TEE’S LIBRARY UPDATE.</h1>

        <div className="mb-4">
          <label className="text-[#4B4DED] font-semibold">PILIH BUKU</label>
          <select
            className="w-full border rounded px-4 py-2"
            value={selectedId}
            onChange={handleSelectChange}
          >
            <option value="">-- Pilih Buku --</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[#4B4DED] font-semibold">JUDUL BUKU</label>
            <input
              name="title"
              className="w-full border rounded px-4 py-2"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-[#4B4DED] font-semibold">PENERBIT BUKU</label>
            <input
              name="author"
              className="w-full border rounded px-4 py-2"
              value={form.author}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-[#4B4DED] font-semibold">DESKRIPSI BUKU</label>
            <textarea
              name="description"
              className="w-full border rounded px-4 py-2"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-[#4B4DED] font-semibold">HARGA BUKU</label>
            <input
              name="price"
              type="number"
              className="w-full border rounded px-4 py-2"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-1">
            <label className="text-[#4B4DED] font-semibold mr-2">RATING BUKU</label>
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                onClick={() => handleRating(index)}
                className={
                  index < form.rating
                    ? "text-yellow-400 cursor-pointer"
                    : "text-gray-400 cursor-pointer"
                }
              >
                ★
              </span>
            ))}
          </div>
          <button
            type="submit"
            className="bg-[#FF7A00] text-white px-6 py-2 rounded font-semibold"
          >
            UPDATE BUKU
          </button>
        </form>
      </div>
      <div className="flex-1 flex items-center justify-center relative">
        <label className="cursor-pointer relative">
          <img
            src={coverPreview}
            alt="Preview"
            className="w-80 h-96 object-cover rounded-lg opacity-60"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-[#FF7A00] text-white font-bold px-4 py-2 rounded">
              GANTI GAMBAR
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>
    </div>
  );
}
