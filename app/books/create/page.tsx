"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CreateBookPage() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    rating: 0,
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("/book-placeholder.png");
  const router = useRouter();

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
    if (!coverFile) return alert("Harap unggah gambar cover.");

    const fileName = `${Date.now()}_${coverFile.name}`.replace(/\s+/g, "_");

    const { data, error } = await supabase.storage
      .from("books")
      .upload(fileName, coverFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: coverFile.type,
      });

    if (error) {
      console.error("Upload error:", error.message);
      return alert("Gagal mengunggah gambar cover.");
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from("books").insert({
      title: form.title,
      author: form.author,
      description: form.description,
      price: Number(form.price),
      rating: form.rating,
      cover_url: fileName,
      user_id: user?.id,
    });

    if (insertError) {
      console.error(insertError);
      return alert("Gagal membuat buku.");
    }

    alert("Buku berhasil dibuat!");
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fc] p-10 gap-10">
      <div className="flex-1 max-w-xl">
        <h1 className="text-3xl font-bold text-[#4B4DED] mb-6">TEE’S LIBRARY CREATE.</h1>
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
                  index < form.rating ? "text-yellow-400 cursor-pointer" : "text-gray-400 cursor-pointer"
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
            BUAT BUKU
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
              TAMBAHKAN GAMBAR
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
