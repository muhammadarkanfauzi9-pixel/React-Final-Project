import React, { useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom"; // 👈 Import useParams
import { useTheme } from "./context/ThemeContext"; 

// Pages
import Home from "./pages/Home/Home";
import FilmDetail from "./pages/filmDetail/FilmDetail";
import Favorite from "./pages/favorite/Favorite";
import Cari from "./components/Cari/Cari";
import SeriesDetail from "./pages/seriesDetail/SeriesDetail";

// Components List
import ListMovie from "./components/List/listMovie/ListMovie";
import ListSeries from "./components/List/listSeries/ListSeries";
import ListTrending from "./components/List/listTrending/ListTrending";
import ListNowPlaying from "./components/List/listNowPlaying/ListNowPlaying";
import Store from "./store/store";

// 💡 KUNCI PERBAIKAN: Komponen Wrapper untuk memaksa render ulang FilmDetail
const FilmDetailWrapper = () => {
    const { id } = useParams();
    // Melewatkan id sebagai key. Ketika id berubah, FilmDetail akan di-mount ulang.
    return <FilmDetail key={id} />; 
};

function App() {
    const { theme, toggleTheme } = useTheme();
    const [isMuted, setIsMuted] = useState(true);

    const toggleSound = () => {
        const iframe = document.getElementById("ytPlayer");
        if (!iframe) return;

        iframe.contentWindow.postMessage(
            JSON.stringify({
                event: "command",
                func: isMuted ? "unMute" : "mute",
                args: [],
            }),
            "*"
        );

        setIsMuted(!isMuted);
    };

    return (
    //header bioskocak
    <div className="min-h-screen transition-colors duration-300 bg-base-100 text-base-content">
      <header className="p-4 flex justify-between items-center shadow-md bg-base-200 text-base-content">
        <h1 className="text-2xl font-bold">
          <span className={${theme === "dark" ? "text-white" : "text-black"}}>
            Bios
          </span>
          <span className="text-red-600">Kocak</span>
        </h1>

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

                <div className="flex gap-2">
                    <label className="swap swap-rotate btn btn-ghost btn-circle">
                        <input 
                            type="checkbox" 
                            checked={!isMuted} 
                            onChange={toggleSound} 
                            className="toggle toggle-sm toggle-error"
                        />
            
                        <span className="swap-on text-2xl">🔊</span>
            
                        <span className="swap-off text-2xl">🔇</span>
                    </label>

                    <label className="swap swap-rotate btn btn-ghost btn-circle">
                    <input 
                        type="checkbox" 
                        checked={theme === "dark"} 
                        onChange={toggleTheme}
                        
                        className="toggle toggle-sm toggle-error"
                        />
                        <span className="swap-off text-2xl">🌙</span> 
                        <span className="swap-on text-2xl">☀️</span>
                    </label>
                </div>
            </header>

            <main className="">
                <Routes>
                    <Route path="/" element={<Home />} />
                    
                    {/* ✅ Ganti FilmDetail dengan FilmDetailWrapper */}
                    <Route path="/film/:id" element={<FilmDetailWrapper />} />
                    
                    <Route path="/series/:id" element={<SeriesDetail />} />
                    <Route path="/favorite" element={<Favorite />} />
                    <Route path="/search" element={<Cari />} />
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
