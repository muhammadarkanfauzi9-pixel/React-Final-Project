// src/views/Home/HomeView.jsx

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaVolumeUp, FaVolumeMute, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

import ListMovie from "../../components/List/listMovie/ListMovie";
import ListSeries from "../../components/List/listSeries/ListSeries";
import ListTrending from "../../components/List/listTrending/ListTrending";
import ListNowPlaying from "../../components/List/listNowPlaying/ListNowPlaying";
import Footer from "../../components/common/Footer";

const HomeView = ({
  trendingMovie,
  trailerKey,
  loading,
  isMuted, // dari App.jsx
  toggleSound, // dari App.jsx
}) => {
  const { theme, toggleTheme } = useTheme();

  const ACCENT_COLOR = "text-red-600";
  const BUTTON_COLOR = "bg-red-700 hover:bg-red-600";
  const IMG_BASE_URL = "https://image.tmdb.org/t/p/original";

  // 🚀 Pastikan iframe sinkron dengan state isMuted di App.jsx
  useEffect(() => {
    const iframe = document.getElementById("ytPlayer");
    if (!iframe) return;

    const funcToCall = isMuted ? "mute" : "unMute";
    iframe.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: funcToCall,
        args: [],
      }),
      "*"
    );
  }, [isMuted]);

  if (loading)
    return (
      <p className="mt-20 text-center text-xl font-semibold text-base-content bg-base-100 min-h-screen">
        ⏳ Memuat data sinema...
      </p>
    );

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* 🎬 HERO SECTION */}
      <div
        className={`relative w-full ${
          trailerKey ? "h-screen md:h-[90vh]" : "h-[60vh] md:h-[80vh]"
        } overflow-hidden`}
      >
        {trailerKey ? (
          <iframe
            id="ytPlayer"
            className="absolute top-0 left-0 w-full h-full"
            // ⚠️ enablejsapi=1 wajib untuk kontrol mute/unmute via JS
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&enablejsapi=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scale(1.3)",
            }}
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${IMG_BASE_URL}${trendingMovie?.backdrop_path})`,
            }}
          />
        )}

        {/* Lapisan gradient dan bayangan bawah */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-base-100/95 to-transparent z-10"></div>

        {/* Overlay Konten */}
        <div className="absolute left-0 bottom-0 top-1/3 md:top-1/2 flex flex-col justify-end px-6 md:px-12 pb-12 z-20 w-full">
          <p
            className={`text-sm md:text-lg font-bold ${ACCENT_COLOR} uppercase mb-1 drop-shadow-md`}
          >
            #TRENDING HARI INI
          </p>
          <h2 className="text-4xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-xl max-w-4xl">
            {trendingMovie?.title}
          </h2>
          <p className="text-sm md:text-xl text-gray-300 max-w-3xl mb-8 line-clamp-3 drop-shadow-md">
            {trendingMovie?.overview}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={`/film/${trendingMovie?.id}`}
              className={`${BUTTON_COLOR} text-white font-bold text-lg px-8 py-3 rounded-full flex items-center justify-center gap-2 transition duration-300 transform hover:scale-[1.02] shadow-lg`}
            >
              ▶ Tonton Sekarang
            </Link>
            <Link
              to={"/favorite"}
              className="bg-base-content/20 hover:bg-base-content/30 backdrop-blur-sm text-white font-semibold text-lg px-8 py-3 rounded-full flex items-center justify-center gap-2 transition duration-300 shadow-md"
            >
              + Tambah ke List
            </Link>
          </div>
        </div>
      </div>

      {/* 🎞️ DAFTAR FILM */}
      <div className="relative -mt-20 md:-mt-32 z-30 px-0 md:px-6 space-y-12 pb-12 top-50">
        <div className="py-2">
          <ListTrending />
        </div>
        <div className="py-2">
          <ListNowPlaying />
        </div>
        <div className="py-2">
          <ListMovie />
        </div>
        <div className="py-2">
          <ListSeries />
        </div>
      </div>

      <div className="py-2 mt-50">
        <Footer />
      </div>

      {/* 🎛️ FLOATING BUTTONS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Tombol Mute/Unmute */}
        <button
          onClick={toggleSound}
          className="p-3 rounded-full text-white shadow-lg bg-red-600 hover:bg-red-700 transition duration-200"
          title={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
        >
          {isMuted ? (
            <FaVolumeMute className="text-xl" />
          ) : (
            <FaVolumeUp className="text-xl" />
          )}
        </button>

        {/* Tombol Dark/Light Theme */}
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full text-white shadow-lg transition duration-200 ${
            theme === "dark"
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
          title={
            theme === "dark" ? "Ubah ke Light Theme" : "Ubah ke Dark Theme"
          }
        >
          {theme === "dark" ? (
            <FaSun className="text-xl text-yellow-300" />
          ) : (
            <FaMoon className="text-xl text-gray-800" />
          )}
        </button>
      </div>
    </div>
  );
};

export default HomeView;
