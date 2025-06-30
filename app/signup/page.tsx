"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [form, setForm] = useState({ fullName: "", email: "", username: "", password: "" });
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const {  error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      data: {
        name: form.fullName,
        username: form.username,
      },
    },
  });

  if (error) {
    alert("Gagal signup: " + error.message);
    return;
  }

  alert("Signup berhasil!");
  router.push("/books/");
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2]">
      <div className="flex w-full max-w-5xl rounded-2xl shadow-lg overflow-hidden bg-white">
        <div className="w-full md:w-1/2 p-10 relative">
          <div className="absolute top-4 right-4 text-sm">
            Already have an account? <button className="text-[#4B4DED] font-bold" onClick={()=>router.push('/login/')}>LOGIN</button>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-[#4B4DED]">Please Fill this form to create an Account</h2>
          <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[#4B4DED] font-semibold mb-1">Full Name</label>
              <input type="text" className="w-full border-2 border-[#4B4DED] rounded-lg px-4 py-2" value={form.fullName} onChange={e=>setForm({...form, fullName: e.target.value})} required />
            </div>
            <div>
              <label className="block text-[#4B4DED] font-semibold mb-1">Email Address</label>
              <input type="email" className="w-full border-2 border-[#4B4DED] rounded-lg px-4 py-2" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} required />
            </div>
            <div>
              <label className="block text-[#4B4DED] font-semibold mb-1">User name</label>
              <input type="text" className="w-full border-2 border-[#4B4DED] rounded-lg px-4 py-2" value={form.username} onChange={e=>setForm({...form, username: e.target.value})} required />
            </div>
            <div>
              <label className="block text-[#4B4DED] font-semibold mb-1">Password</label>
              <input type="password" className="w-full border-2 border-[#4B4DED] rounded-lg px-4 py-2" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} required />
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <input type="checkbox" required className="mr-2" /> By signing up, I’ve read and agree to our <a href="#" className="underline ml-1">Privacy Policy</a> and <a href="#" className="underline ml-1">Terms of use</a>.
            </div>
            <button type="submit" className="w-full bg-[#FF7A00] text-white py-2 rounded-lg font-bold text-lg mt-2">Sign Up</button>
            <div className="flex items-center my-2">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="mx-2 text-gray-400">OR</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>
            <div className="flex gap-2">
              <button type="button" className="flex-1 border-2 border-gray-300 rounded-lg py-2 flex items-center justify-center gap-2"><img src="/google.svg" alt="Google" className="w-10 h-10" /> Google</button>
              <button type="button" className="flex-1 border-2 border-gray-300 rounded-lg py-2 flex items-center justify-center gap-2"><img src="/facebook.svg" alt="Facebook" className="w-10 h-10" /> Facebook</button>
            </div>
          </form>
        </div>
        <div className="hidden md:flex w-1/2 bg-[#4B4DED] flex-col items-center justify-center relative">
          <div className="absolute top-10 left-10 text-white text-3xl font-bold">Explore the World<br/>with <span className="text-[#FF7A00]">BOOKS</span></div>
          <img src="/signup.png" alt="Signup Illustration" className="w-80 h-80 mt-24" />
        </div>
      </div>
    </div>
  );
}