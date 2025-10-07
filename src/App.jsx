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

// Komponen Wrapper untuk memaksa render ulang FilmDetail ketika ID berubah
const FilmDetailWrapper = () => {
    const { id } = useParams(); // Mengambil ID dari URL
    // Menggunakan 'key' unik berdasarkan 'id' akan memaksa komponen FilmDetail me-render ulang
    return <FilmDetail key={id} />; 
};

function App() {
    const { theme } = useTheme();
    const [isMuted, setIsMuted] = useState(true); // State untuk status mute audio (untuk trailer)

    // Fungsi untuk mengontrol mute/unmute pada YouTube iframe (di halaman Home)
    const toggleSound = () => {
        const iframe = document.getElementById("ytPlayer");

        if (!iframe) {
            console.warn("Iframe ytPlayer not found.");
            setIsMuted(!isMuted); // Tetap toggle state meskipun iframe tidak ditemukan
            return;
        }

        const funcToCall = isMuted ? "unMute" : "mute";

        // Mengirim perintah ke iframe YouTube Player API
        setTimeout(() => {
            iframe.contentWindow.postMessage(
                JSON.stringify({
                    event: "command",
                    func: funcToCall,
                    args: [],
                }),
                "*" // Target semua origin
            );
        }, isMuted ? 50 : 0);

        setIsMuted(!isMuted);
    };

    return (
        <div className="min-h-screen transition-colors duration-300 bg-base-100 text-base-content">
            
            {/* HEADER */}
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

                {/* Div Spacer (untuk keseimbangan layout jika ada elemen lain di kanan) */}
                <div className="w-[100px] h-0 md:h-auto md:w-auto"></div>
            </header>

            {/* ROUTES */}
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
        </div>
    );
}

export default App;