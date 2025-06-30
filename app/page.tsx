"use client";

import { useState } from 'react';
import { Search, BookOpen, ShoppingCart, Clock, Facebook, Twitter, Mail, Instagram, ArrowRight, Star, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';



export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    {
      icon: BookOpen,
      title: "Used",
      subtitle: "Book Buying",
      description: "Sell your books and earn money"
    },
    {
      icon: ArrowRight,
      title: "Returns",
      subtitle: "& Exchanges",
      description: "Easy return and exchange policy"
    },
    {
      icon: ShoppingCart,
      title: "Online",
      subtitle: "Ordering",
      description: "Order books from anywhere"
    },
    {
      icon: Clock,
      title: "24 Hours",
      subtitle: "customer support",
      description: "Round the clock assistance"
    }
  ];

    const [trendingBooks, setTrendingBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchTrendingBooks = async () => {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .order('rating', { ascending: false }) // atau berdasarkan field lain seperti 'created_at'
          .limit(10); // ambil 10 buku teratas

        if (error) {
          console.error("Error fetching trending books:", error.message);
        } else {
          setTrendingBooks(data || []);
        }

        setLoading(false);
      };

      fetchTrendingBooks();
    }, []);


  const genres = [
    "Adventure", "Biography", "Thriller", "Love",
    "Fiction", "Science Fiction", "History", "Adult"
  ];

  const authors = [
    {
      name: "James Clear",
      books: "600+ books",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Lucy Caldwell",
      books: "150+ Books",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Alan Trotter",
      books: "10 Ebooks",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Sarah Raughan",
      books: "100+ Novels",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Chip Heath",
      books: "250+Books",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Tee's Library</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="/books/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Book</a>
              <a href="#features" className="text-gray-900 hover:text-blue-600 transition-colors font-medium">Features</a>
              <a href="#trending-books" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Trending Books</a>
            </nav>

            {/* Search and Auth */}
            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search books..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600" asChild>
                <a href="/login/">LOGIN</a>
              </Button>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6" asChild>
                <a href="/signup/">Sign Up</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-blue-600 font-medium text-lg">Anywhere and Everywhere</p>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Welcome To <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">TEE'S LIBRARY</span>
              </h1>
            </div>
            
            <div className="space-y-4 text-lg text-gray-600">
              <p>Track your Reading and Build your Library</p>
              <p>Discover your next Favourite Book.</p>
              <p>Browse from the Largest Collections of Ebooks.</p>
              <p>Read stories from anywhere at anytime.</p>
            </div>

            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started For Free
            </Button>

            {/* Contact Info */}
            <div className="pt-8 space-y-3">
              <h3 className="font-semibold text-gray-900">Contact us:</h3>
              <p className="text-gray-600">Address: 6 dom columbia St.</p>
              <p className="text-gray-600">Email: Tee's.Library@gmail.com</p>
              
              <div className="flex space-x-4 pt-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                  <Facebook className="w-5 h-5 text-blue-600" />
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                  <Twitter className="w-5 h-5 text-blue-600" />
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                  <Instagram className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile App Illustration */}
          <div className="relative">
            <div className="relative mx-auto w-80 h-96 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-white m-4 rounded-2xl overflow-hidden">
                {/* Phone Screen Content */}
                <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                  <div className="space-y-4">
                    {/* Top shelf */}
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <div className="w-6 h-8 bg-red-500 rounded-sm"></div>
                        <div className="w-6 h-8 bg-green-500 rounded-sm"></div>
                        <div className="w-6 h-8 bg-blue-500 rounded-sm"></div>
                        <div className="w-6 h-8 bg-yellow-500 rounded-sm"></div>
                        <div className="w-6 h-8 bg-purple-500 rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* Middle shelf */}
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <div className="w-6 h-8 bg-indigo-500 rounded-sm"></div>
                        <div className="w-6 h-8 bg-pink-500 rounded-sm"></div>
                        <div className="w-6 h-8 bg-teal-500 rounded-sm"></div>
                        <div className="w-6 h-8 bg-orange-500 rounded-sm"></div>
                        <div className="w-6 h-8 bg-cyan-500 rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* Bottom shelf */}
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <div className="w-6 h-8 bg-emerald-500 rounded-sm"></div>
                        <div className="w-6 h-8 bg-rose-500 rounded-sm"></div>
                        <div className="w-6 h-8 bg-violet-500 rounded-sm"></div>
                        <div className="w-6 h-8 bg-amber-500 rounded-sm"></div>
                        <div className="w-6 h-8 bg-lime-500 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation dots */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating books */}
            <div className="absolute -left-8 top-20 w-16 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg shadow-lg transform rotate-12 opacity-80"></div>
            <div className="absolute -right-6 top-32 w-12 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg shadow-lg transform -rotate-12 opacity-80"></div>
            <div className="absolute -left-4 bottom-16 w-14 h-18 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg shadow-lg transform rotate-6 opacity-80"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Some Of Our Features include:
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">{feature.title}</h3>
                <p className="text-blue-100 font-medium mb-2">{feature.subtitle}</p>
                <p className="text-blue-200 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse Genres Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                BROWSE GENRES
              </span>
            </h2>
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm font-medium">All Categories</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {genres.map((genre, index) => (
              <Button
                key={index}
                variant="outline"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 py-3 px-6 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {genre}
              </Button>
            ))}
          </div>

          {/* Popular Authors Section */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                POPULAR AUTHORS
              </span>
            </h3>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 font-medium">
              See All
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {authors.map((author, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-4">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <img 
                      src={author.image} 
                      alt={author.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full border-4 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{author.name}</h4>
                <p className="text-sm text-orange-500 font-medium">{author.books}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Books Section */}
      <section className="py-20 bg-white" id="trending-books">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              TOP TRENDING BOOKS
            </span>
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {loading ? (
              <p className="text-center text-gray-500 col-span-full">Loading books...</p>
            ) : (
              trendingBooks.map((book, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg flex flex-col h-full"
                >
                  <CardContent className="p-0 flex flex-col h-full">
                    {/* Gambar Buku */}
                    <div className="relative overflow-hidden rounded-t-lg h-64">
                      <img
                        src={
                          supabase.storage
                            .from("books")
                            .getPublicUrl(book.cover_url).data.publicUrl || "/book-placeholder.png"
                        }
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Konten Buku */}
                    <div className="flex flex-col justify-between flex-grow p-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-gray-900 leading-tight line-clamp-2">{book.title}</h3>
                        <p className="text-gray-600 text-sm">{book.author}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-700">{book.rating}</span>
                          </div>
                          <span className="text-lg font-bold text-blue-600">
                            Rp {Number(book.price).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>

                      {/* Tombol Book */}
                      <Button
                        className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                        asChild
                      >
                        <a href="/login/">Book</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

              ))
            )}

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Tee's Library</span>
              </div>
              <p className="text-gray-400">Your gateway to endless knowledge and entertainment.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#" className="text-gray-400 hover:text-white transition-colors block">Home</a>
                <a href="#features" className="text-gray-400 hover:text-white transition-colors block">Features</a>
                <a href="#trending-books" className="text-gray-400 hover:text-white transition-colors block">Trending Books</a>
                <a href="/books/" className="text-gray-400 hover:text-white transition-colors block">Books</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <div className="space-y-2">
                <a href="#" className="text-gray-400 hover:text-white transition-colors block">Book Rental</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors block">Digital Library</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors block">Study Rooms</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors block">Events</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <Facebook className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <Twitter className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <Instagram className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Tee's Library. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}