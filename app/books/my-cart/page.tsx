"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MyCartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [purchasedBooks, setPurchasedBooks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
        if (error || !sessionData?.session?.user) {
          console.warn("User belum login.");
          return;
        }
        const user = sessionData.session.user;

      if (!user) return;
      setUser(user);

      const { data: cart } = await supabase
        .from("cart")
        .select("*, books(*)")
        .eq("user_id", user.id);

      const cartWithImages = await Promise.all(
        (cart || []).map(async (item) => {
          const { data } = supabase.storage.from("books").getPublicUrl(item.books?.cover_url);
          return {
            ...item,
            publicImage: data?.publicUrl || "/book-placeholder.png",
          };
        })
      );
      setCartItems(cartWithImages);

      const { data: sales } = await supabase
        .from("sales")
        .select("*, books(*)")
        .eq("seller_id", user.id);

      const salesWithImages = await Promise.all(
        (sales || []).map(async (item) => {
          const { data } = supabase.storage.from("books").getPublicUrl(item.books?.cover_url);
          return {
            ...item,
            publicImage: data?.publicUrl || "/book-placeholder.png",
          };
        })
      );
      setPurchasedBooks(salesWithImages);
    };

    fetchData();
  }, []);

  const handleToggle = (id: string) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckout = async () => {
    if (!user) return;

    const selectedBooks = cartItems.filter((item) => checkedItems.includes(item.id));

    const inserts = selectedBooks.map((item) => ({
      seller_id: user.id,
      book_id: item.book_id,
      price: item.books?.price || item.price,
    }));

    const { error } = await supabase.from("sales").insert(inserts);

    if (!error) {
      await supabase.from("cart").delete().in("id", checkedItems);
      setCartItems((prev) => prev.filter((item) => !checkedItems.includes(item.id)));
      setCheckedItems([]);

      const { data: updatedSales } = await supabase
        .from("sales")
        .select("*, books(*)")
        .eq("seller_id", user.id);

      const updatedSalesWithImages = await Promise.all(
        (updatedSales || []).map(async (item) => {
          const { data } = supabase.storage.from("books").getPublicUrl(item.books?.cover_url);
          return {
            ...item,
            publicImage: data?.publicUrl || "/book-placeholder.png",
          };
        })
      );

      setPurchasedBooks(updatedSalesWithImages);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#e6e4ff]">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-[#404249] mb-8">My Cart</h1>
        {cartItems.length === 0 ? (
          <p className="text-gray-600">Cart kosong.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center relative"
                >
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(item.id)}
                    onChange={() => handleToggle(item.id)}
                    className="absolute top-4 right-4 w-5 h-5"
                  />
                  <img
                    src={item.publicImage}
                    alt={item.books?.title}
                    className="w-40 h-56 object-cover rounded mb-4"
                  />
                  <h2 className="text-xl font-bold mb-1 text-center">
                    {item.books?.title || "Tanpa Judul"}
                  </h2>
                  <h3 className="text-sm text-gray-600 mb-1">
                    {item.books?.author || "Tanpa Penulis"}
                  </h3>
                  <p className="text-gray-500 text-sm text-center mb-2">
                    {item.books?.description || "-"}
                  </p>
                  <div className="text-[#ff805d] font-bold mb-2">
                    Rp {Number(item.books?.price || 0).toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleCheckout}
              className="mt-6 px-6 py-2 bg-[#4B4DED] text-white rounded hover:bg-[#3a3ac9]"
            >
              Checkout
            </button>
          </>
        )}

        {/* Purchased */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#404249] mb-4">Purchased Books</h2>
          {purchasedBooks.length === 0 ? (
            <p className="text-gray-600">Belum ada buku yang dibeli.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {purchasedBooks.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center"
                >
                  <img
                    src={item.publicImage}
                    alt={item.books?.title}
                    className="w-40 h-56 object-cover rounded mb-4"
                  />
                  <h2 className="text-xl font-bold mb-1 text-center">
                    {item.books?.title || "Tanpa Judul"}
                  </h2>
                  <h3 className="text-sm text-gray-600 mb-1">
                    {item.books?.author || "Tanpa Penulis"}
                  </h3>
                  <p className="text-gray-500 text-sm text-center mb-2">
                    Rp {Number(item.price || 0).toLocaleString("id-ID")}
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
