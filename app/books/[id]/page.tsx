export const dynamic = 'force-dynamic';
import BookDetailClient from './BookDetailClient';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: cookies() // ✅ panggil fungsinya
  }
);

  const { data: book } = await supabase
    .from('books')
    .select('*')
    .eq('id', params.id)
    .single();

  return (
    <div className="min-h-screen bg-[#e6e4ff] flex items-center justify-center p-8">
      {book ? (
      <BookDetailClient
        id={book.id}
        title={book.title}
        author={book.author}
        description={book.description}
        rating={book.rating}
        price={book.price}
        cover_url={book.cover_url}
        image={supabase.storage.from("covers").getPublicUrl(book.cover_url).data.publicUrl}
      />
      ) : (
        <div>Data buku tidak ditemukan.</div>
      )}

          </div>
        );
      }

      export async function generateStaticParams() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/books?select=id`, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
        });

        const books = await res.json();

        return books.map((book: { id: string }) => ({
          id: book.id,
        }));
      }
