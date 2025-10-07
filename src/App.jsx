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

// Components List
import ListMovie from "./components/List/listMovie/ListMovie";
import ListSeries from "./components/List/listSeries/ListSeries";
import ListTrending from "./components/List/listTrending/ListTrending";
import ListNowPlaying from "./components/List/listNowPlaying/ListNowPlaying";

// Komponen Wrapper untuk memaksa render ulang FilmDetail
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
      {/* HEADER */}
      <header className="sticky top-0 z-40 p-4 flex justify-between items-center shadow-md bg-base-200 text-base-content">
        <h1 className="text-2xl font-bold">
          <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
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

        <div className="w-[100px] h-0 md:h-auto md:w-auto"></div>
      </header>

      {/* ROUTES */}
      <main>
        <Routes>
          <Route path="/" element={<Home isMuted={isMuted} toggleSound={toggleSound} />} />
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
