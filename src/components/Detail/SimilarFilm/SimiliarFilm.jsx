// SimiliarFilm.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // 👈 Ditambahkan: Import Link untuk navigasi

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

const SimiliarFilm = ({ filmId, theme }) => {
  const [similiar, setSimiliar] = useState([]);

  useEffect(() => {
    const fetchSimiliar = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${filmId}/similar`,
          {
            headers: {
              accept: "application/json",
              Authorization: "Bearer " + import.meta.env.VITE_KEY_TMDB,
            },
          }
        );
        setSimiliar(res.data.results);
      } catch (err) {
        console.error("Gagal memuat similar film:", err);
      }
    };

    if (filmId) fetchSimiliar();
  }, [filmId]); // Ditambahkan dependency filmId

    // Menambahkan penanganan jika tidak ada film serupa (opsional, untuk UX yang lebih baik)
    if (similiar.length === 0) {
        return (
             <div 
               className={`p-4 rounded-xl transition-colors duration-300 ${
                    theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                }`}
            >
                <h2 className="text-lg font-bold mb-3">🎞️ Similar Films</h2>
                <p className="text-sm">Tidak ada film serupa yang ditemukan.</p>
            </div>
        );
    }
    
  return (
    <div
      className={`p-4 rounded-xl transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h2 className="text-lg font-bold mb-3">🎞️ Similar Films</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {similiar.map((film) => (
          <Link // 👈 PERBAIKAN: Ganti <div> dengan <Link>
            key={film.id}
            to={`/film/${film.id}`} // 👈 Ditambahkan: Path ke detail film yang bersangkutan
            className={`rounded-lg overflow-hidden transition-transform hover:scale-105 ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <img
              src={
                film.backdrop_path
                  ? `${IMG_BASE}${film.backdrop_path}`
                  : "https://via.placeholder.com/500x281?text=No+Image"
              }
              alt={film.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-2">
              <p className="text-xs font-semibold truncate">{film.original_title}</p>
              <p className="text-xs text-gray-400">⭐ {film.vote_average?.toFixed(1)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimiliarFilm;