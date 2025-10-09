// src/App.jsx 

import React, { useState } from "react";
import { 
    Routes, 
    Route, 
    Link, 
    useParams, 
} from "react-router-dom";
import { useTheme } from "./context/ThemeContext";

// Pages
import Home from "./pages/Home/Home";
import FilmDetail from "./pages/filmDetail/FilmDetail";
import Favorite from "./pages/favorite/Favorite";
import Cari from "./components/Cari/Cari";
import SeriesDetail from "./pages/seriesDetail/SeriesDetail";

// Components
import ListMovie from "./components/List/listMovie/ListMovie";
import ListSeries from "./components/List/listSeries/ListSeries";
import ListTrending from "./components/List/listTrending/ListTrending";
import ListNowPlaying from "./components/List/listNowPlaying/ListNowPlaying";

// Tambahkan ikon dari react-icons yang hilang (asumsi Anda menggunakan library ini)
import { FaTwitter, FaInstagram, FaGithub, FaHeart } from 'react-icons/fa'; 


// Komponen untuk mendapatkan tahun saat ini
const FooterContent = () => {
    const currentYear = new Date().getFullYear(); 
    
    // Pindahkan seluruh markup footer ke komponen ini (opsional tapi disarankan)
    return (
        <footer className="footer footer-center p-10 bg-base-300 text-base-content border-t-2 border-red-900 shadow-2xl mt-50 w-full  ">
            
            {/* === Bagian Logo atau Nama Aplikasi === */}
            <div className="flex flex-col items-center">
                <Link to="/" className="text-4xl font-extrabold text-red-900 transition-colors duration-300 hover:text-red-600">
                    BiosKocak
                </Link>
                <p className="text-sm mt-1 text-gray-500">Discover your next favorite movie or series.</p>
            </div>
        
            {/* === Bagian Tautan Navigasi === */}
            <nav className="grid grid-flow-col gap-8 text-lg font-semibold text-base-content">
                <Link to="/about" className="link link-hover text-base-content transition-colors duration-300 hover:text-red-600">
                    About Us
                </Link>
                <Link to="/privacy" className="link link-hover text-base-content transition-colors duration-300 hover:text-red-600">
                    Privacy Policy
                </Link>
                <Link to="/contact" className="link link-hover text-base-content transition-colors duration-300 hover:text-red-600">
                    Contact
                </Link>
                <Link to="/api-status" className="link link-hover text-base-content transition-colors duration-300 hover:text-red-600">
                    API Status
                </Link>
            </nav>
        
            {/* === Bagian Ikon Media Sosial === */}
            <div className="grid grid-flow-col gap-6">
                <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl text-base-content transition-colors duration-300 hover:text-red-600 hover:scale-110"
                >
                    <FaTwitter />
                </a>
                <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl text-base-content transition-colors duration-300 hover:text-red-600 hover:scale-110"
                >
                    <FaInstagram />
                </a>
                <a
                    href="https://github.com/your-username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl text-base-content transition-colors duration-300 hover:text-red-600 hover:scale-110"
                >
                    <FaGithub />
                </a>
            </div>
        
            {/* === Bagian Hak Cipta dan Sumber Data === */}
            <aside className="text-sm text-gray-500">
                <p>
                    Built with <FaHeart className="inline text-red-600 mx-1 animate-pulse" /> by BiosKocak Team.
                </p>
                <p className="mt-1">
                    Copyright © {currentYear} - All right reserved.
                    Data provided by
                    <a
                        href="https://www.themoviedb.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 font-semibold ml-1 link link-hover"
                    >
                        The Movie Database (TMDB)
                    </a>.
                </p>
            </aside>
        </footer>
    );
};


// Komponen Wrapper untuk memaksa render ulang FilmDetail ketika ID berubah
const FilmDetailWrapper = () => {
    const { id } = useParams(); 
    return <FilmDetail key={id} />; 
};

function App() {
    const { theme } = useTheme();
    const [isMuted, setIsMuted] = useState(true); 

    const toggleSound = () => {
        const iframe = document.getElementById("ytPlayer");

        if (!iframe) {
            console.warn("Iframe ytPlayer not found.");
            setIsMuted(!isMuted); 
            return;
        }

        const funcToCall = isMuted ? "unMute" : "mute";

        setTimeout(() => {
            iframe.contentWindow.postMessage(
                JSON.stringify({
                    event: "command",
                    func: funcToCall,
                    args: [],
                }),
                "*" 
            );
        }, isMuted ? 50 : 0);

        setIsMuted(!isMuted);
    };

    return (
        <div className="min-h-screen transition-colors duration-300 bg-base-100 text-base-content">
            
            {/* HEADER (Sticky di bagian atas) */}
            <header className="sticky top-0 z-40 p-4 flex justify-between items-center shadow-md bg-base-200 text-base-content">
                <h1 className="text-2xl font-bold">
                    <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
                        Bios
                    </span>
                    <span className="text-red-600">Kocak</span>
                </h1>

                {/* Navigasi Utama */}
                <nav className="flex gap-3">
                    <Link to="/" className="btn btn-sm btn-ghost hover:text-red-700">
                        Home
                    </Link>
                    <Link to="/favorite" className="btn btn-sm btn-ghost hover:text-red-700">
                        Favorite
                    </Link>
                    <Link to="/search" className="btn btn-sm btn-ghost hover:text-red-700">
                        Search
                    </Link>
                </nav>

                {/* Div Spacer (untuk keseimbangan layout) */}
                <div className="w-[100px] h-0 md:h-auto md:w-auto"></div>
            </header>

            {/* ROUTES (Konten Utama) */}
            <main>
                <Routes>
                    {/* Halaman Utama */}
                    <Route path="/" element={<Home isMuted={isMuted} toggleSound={toggleSound} />} />
                    
                    {/* Halaman Detail */}
                    <Route path="/film/:id" element={<FilmDetailWrapper />} />
                    <Route path="/series/:id" element={<SeriesDetail />} />
                    
                    {/* Halaman Fungsional */}
                    <Route path="/favorite" element={<Favorite />} />
                    <Route path="/search" element={<Cari />} />
                    
                    {/* Halaman Daftar (List) */}
                    <Route path="/movies" element={<ListMovie />} />
                    <Route path="/series" element={<ListSeries />} />
                    <Route path="/trending" element={<ListTrending />} />
                    <Route path="/now-playing" element={<ListNowPlaying />} />
                </Routes>
            </main>
            
            {/* FOOTER (Ditempatkan di sini, di luar <header> dan setelah <main>) */}
            <FooterContent /> 
        </div>
    );
}

export default App;