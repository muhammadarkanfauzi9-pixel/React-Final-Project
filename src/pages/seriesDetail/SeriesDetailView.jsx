// src/components/Detail/SeriesDetail/SeriesDetailView.jsx (Presenter/View)

import React from "react";
import { Link } from "react-router-dom"; // ✅ Tetap perlu mengimpor Link

const IMG_BASE = "https://image.tmdb.org/t/p/original";

const SeriesDetailView = ({ series, trailerKey, cast, similar, theme, handleFavorite }) => {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
      {/* Header */}
      <div className="relative w-full h-[60vh] bg-cover bg-center" style={{ backgroundImage: `url(${IMG_BASE}${series.backdrop_path})` }}>
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">{series.name}</h1>
          <p className="text-gray-300 text-lg mt-2 drop-shadow-md">
            {series.first_air_date} | ⭐ {series.vote_average?.toFixed(1)}
          </p>
        </div>

        {/* Tombol Back */}
        <div className="absolute left-6 bottom-6">
          <Link to="/" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition text-sm">
            Back
          </Link>
        </div>

        {/* Tombol Favorite */}
        <button
          onClick={handleFavorite} // 👈 Menggunakan fungsi dari props
          className="absolute top-4 right-6 z-20 bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
          title="Tambah ke Favorite"
        >
          ❤️
        </button>
      </div>

      {/* Trailer */}
      {trailerKey && (
        <div className="w-full flex justify-center my-6">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="Trailer"
            className="w-[90%] h-[400px] rounded-lg"
            allowFullScreen
          />
        </div>
      )}

      {/* Deskripsi */}
      <div className={`p-6 m-4 rounded-xl shadow-md transition-colors duration-300 ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
        <h2 className="text-lg font-bold mb-2">{series.original_name}</h2>
        <p className="text-sm mb-1">🎬 Status: {series.status}</p>
        <p className="text-sm mb-1">🗓️ First Air: {series.first_air_date}</p>
        <p className="text-sm mb-1">⭐ Rating: {series.vote_average?.toFixed(1)}</p>
        <p className="text-sm mb-1">🔥 Popularity: {series.popularity}</p>
        <p className="text-sm mb-1">
          🏢 Production: {series.production_companies?.map(c => c.name).filter(Boolean).join(", ")}
        </p>
        <p className="text-sm mb-1">
          🗣️ Language: {series.spoken_languages?.map(l => l.english_name).join(", ")}
        </p>
        {series.homepage && (
          <a href={series.homepage} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline text-sm block mt-2">
            🌐 {series.homepage}
          </a>
        )}
        <p className={`mt-3 text-sm leading-snug ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          {series.overview}
        </p>
      </div>

      {/* Seasons */}
      {series.seasons && series.seasons.length > 0 && (
        <div className={`p-6 m-4 rounded-xl shadow-md transition-colors duration-300 ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
          <h3 className="text-lg font-bold mb-3">📺 Seasons</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {series.seasons.map(season => (
              <div key={season.id} className="rounded-lg overflow-hidden">
                <img
                  src={season.poster_path ? `${IMG_BASE}${season.poster_path}` : "https://via.placeholder.com/200x300?text=No+Image"}
                  alt={season.name}
                  className="w-full h-40 object-cover"
                />
                <p className="text-xs mt-1 text-center">{season.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Casting */}
      {cast.length > 0 && (
        <div className={`p-6 m-4 rounded-xl shadow-md transition-colors duration-300 ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
          <h3 className="text-lg font-bold mb-3">👥 Casting</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {cast.map(c => (
              <div key={c.id} className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                <img
                  src={c.profile_path ? `${IMG_BASE}${c.profile_path}` : "https://via.placeholder.com/200x300?text=No+Image"}
                  alt={c.original_name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-2 text-xs">
                  <p className="font-semibold">{c.original_name}</p>
                  <p className="text-gray-400">{c.character}</p>
                </div>
              </div>
            ))}
            </div>
        </div>
      )}

      {/* Similar Series */}
      {similar.length > 0 && (
        <div className={`p-6 m-4 rounded-xl shadow-md transition-colors duration-300 ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
          <h3 className="text-lg font-bold mb-3">🎞️ Similar Series</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {similar.map(s => (
              <Link 
                key={s.id} 
                to={`/series/${s.id}`} 
                className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} hover:scale-105 transition-transform`}
              >
                <img
                  src={s.backdrop_path ? `${IMG_BASE}${s.backdrop_path}` : "https://via.placeholder.com/500x281?text=No+Image"}
                  alt={s.name}
                  className="w-full h-32 object-cover"
                />
                <p className="text-xs font-semibold truncate p-2">{s.name}</p>
                </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesDetailView;