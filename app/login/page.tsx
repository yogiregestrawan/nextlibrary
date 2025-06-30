"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      alert("Login gagal: " + error.message);
      return;
    }

    alert("Login berhasil!");
    router.push("/books");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2]">
      <div className="flex w-full max-w-4xl rounded-2xl shadow-lg overflow-hidden bg-white">
        <div className="hidden md:flex w-1/2 bg-[#4B4DED] flex-col items-center justify-center relative">
          <div className="absolute top-10 left-10 text-white text-3xl font-bold">
            welcome<br />Back!
          </div>
          <img src="/login.png" alt="Login Illustration" className="w-80 h-80 mt-24" />
        </div>
        <div className="w-full md:w-1/2 p-10 relative">
          <h2 className="text-2xl font-bold mb-2 text-[#4B4DED]">Hello! Welcome back.</h2>
          <p className="text-gray-500 mb-6">
            Login with the data you entered during Registration.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[#4B4DED] font-semibold mb-1">Email Address *</label>
              <input
                type="email"
                className="w-full border-2 border-[#4B4DED] rounded-lg px-4 py-2"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-[#4B4DED] font-semibold mb-1">Password*</label>
              <input
                type="password"
                className="w-full border-2 border-[#4B4DED] rounded-lg px-4 py-2"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <div className="flex justify-end mt-1">
                <a href="#" className="text-xs text-[#4B4DED] hover:underline">Forgot Password?</a>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#FF7A00] text-white py-2 rounded-lg font-bold text-lg mt-2"
            >
              Login Now
            </button>
            <div className="flex items-center my-2">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="mx-2 text-gray-400">OR</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>
            <button
              type="button"
              className="w-full border-2 border-gray-300 rounded-lg py-2 flex items-center justify-center gap-2"
            >
              <img src="/google.svg" alt="Google" className="w-10 h-10" />
              Continue with Google
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an Account?{" "}
            <button className="text-[#4B4DED] font-bold" onClick={() => router.push('/signup/')}>
              REGISTER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
