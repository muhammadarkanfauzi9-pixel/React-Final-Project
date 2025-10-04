// FilmDetailView.jsx
import React from "react";
import { Link } from "react-router-dom";
import DeskripsiFilm from "../../components/Detail/DeskripsiFilm/DeskripsiFilm";
import SimiliarFilm from "../../components/Detail/SimilarFilm/SimiliarFilm";
import Casting from "../../components/Detail/CastingFilm/Casting";
import { useTheme } from "../../context/ThemeContext";

const IMG_BASE = "https://image.tmdb.org/t/p/original";

const FilmDetailView = ({ film, trailerKey }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Header dengan background */}
      <div
        className="relative w-full h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${IMG_BASE}${film.backdrop_path})` }}
      >
        {/* Overlay redup */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Judul di tengah */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            {film.title}
          </h1>
          <p className="text-gray-300 text-lg mt-2 drop-shadow-md">
            {film.release_date} | ⭐ {film.vote_average?.toFixed(1)}
          </p>
        </div>

        {/* Tombol Back di pojok kiri bawah */}
        <div className="absolute left-6 bottom-6">
          <Link
            to="/"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition text-sm"
          >
            Back
          </Link>
        </div>
      </div>

      {/* Trailer */}
      {trailerKey && (
        <div className="w-full flex justify-center my-6">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="Trailer"
            className="w-[90%] h-[400px] rounded-lg"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* Deskripsi Film */}
      <DeskripsiFilm film={film} theme={theme} />

      {/* Casting */}
      <Casting filmId={film.id} theme={theme} />

      {/* Similar Film */}
      <SimiliarFilm filmId={film.id} theme={theme} />
    </div>
  );
};

export default FilmDetailView;
