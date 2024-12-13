"use client";
import 'flowbite/dist/flowbite.css';
import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import React, {useEffect} from 'react';
import { useRouter } from 'next/navigation';
import Header from './header';
import Footer from './footer';
import Image from 'next/image'

export default function HomePage() {
  const router = useRouter();
  const rssFeedUrl = "https://audioboom.com/channels/5113871.rss";

  const navigateToEpisode = (index: number) => {
    router.push(`/player?rssfeed=${encodeURIComponent(rssFeedUrl)}&index=${index}`);
  };

  // useEffect(() => {
  //   const savedTheme = localStorage.getItem('theme');
  //   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  //   if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  // }, []);

  const toggleTheme = () => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div className="min-h-screen items-center bg-gray-100">
      <Header />
      <section className="bg-blue-600 text-white text-center py-20">
        <div className="flex justify-center items-center mb-4">
          <Image
            src="/2.png"
            width={1000}
            height={1000}
            alt=" "
          />
        </div>
        <h1 className="text-5xl font-bold mb-4">Welcome to BingeCast</h1>
        <p className="text-2xl">Your favorite podcasts, all in one place.</p>
        <br/><br/>
        <a href="/home/">
        <button  className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800">
          Get Started 
        </button>
        </a>
      </section>
      
      <section className="py-16 ">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10">Featured Podcasts</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
            <div
              className="bg-white rounded-lg shadow-lg p-6 transition-all hover:shadow-xl hover:scale-105 cursor-pointer"
              onClick={() => navigateToEpisode(0)}
            >
              <img src="https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/24/6d/f5/246df581-fb17-d179-d607-5bbceccf0507/mza_7321194002536810327.jpg/1200x1200bf.webp" alt="Podcast 1" className="mb-4 w-full h-48 object-cover rounded" />
              <h3 className="text-2xl font-bold mb-2">Auto Alex Podcast</h3>
              <p className="text-gray-600">The automotive adventures you see on YouTube only tell half the story. So join us, as we discuss failed road trips, unbelievable car deals and WTF moments!</p>
            </div>
            <div
              className="bg-white rounded-lg shadow-lg p-6 transition-all hover:shadow-xl hover:scale-105 cursor-pointer"
              onClick={() => navigateToEpisode(1)}
            >
              <img src="/public/file.svg" alt="Podcast 2" className="mb-4 w-full h-48 object-cover rounded" />
              <h3 className="text-2xl font-bold mb-2">Podcast Episode 2</h3>
              <p className="text-gray-600">A short description of the second oldest podcast episode.</p>
            </div>
            <div
              className="bg-white rounded-lg shadow-lg p-6 transition-all hover:shadow-xl hover:scale-105 cursor-pointer"
              onClick={() => navigateToEpisode(2)}
            >
              <img src="/public/file.svg" alt="Podcast 3" className="mb-4 w-full h-48 object-cover rounded" />
              <h3 className="text-2xl font-bold mb-2">Podcast Episode 3</h3>
              <p className="text-gray-600">A short description of the third oldest podcast episode.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
