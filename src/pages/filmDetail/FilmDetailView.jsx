// FilmDetailView.jsx
import React from "react";
import { Link } from "react-router-dom";
// Ganti path import sesuai dengan struktur Anda
import DeskripsiFilm from "../../components/Detail/DeskripsiFilm/DeskripsiFIlm";
import SimiliarFilm from "../../components/Detail/SimilarFilm/SimiliarFilm";
import Casting from "../../components/Detail/CastingFilm/Casting";
import RatingReview from "../../components/Detail/RatingReview/RatingReview";
import { useTheme } from "../../context/ThemeContext";
import { IoIosArrowBack } from "react-icons/io";
import { FaStar, FaPlay, FaGlobe, FaClock } from "react-icons/fa";

const IMG_BASE = "https://image.tmdb.org/t/p/original";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500"; 

const FilmDetailView = ({ film, trailerKey}) => {
    const { theme } = useTheme();

    const themeClass = theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
    const primaryBtnClass = "flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-[1.02]";
    const secondaryBtnClass = "flex items-center justify-center gap-2 bg-transparent border-2 border-red-700 hover:bg-red-700 hover:text-white text-red-700 font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300";
    
    // Fungsi utilitas untuk durasi
    const formatRuntime = (minutes) => {
        if (!minutes || minutes === 0) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };


    return (
        <div className={`min-h-screen transition-colors duration-300 ${themeClass}`}>
            
            {/* 1. HERO SECTION & POSTER (Aesthetic 2-Kolom) */}
            <div className="relative w-full h-auto pb-12">
                
                {/* Backdrop Image */}
                <div 
                    className="w-full h-[50vh] md:h-[65vh] bg-cover bg-center" 
                    style={{ backgroundImage: `url(${IMG_BASE}${film.backdrop_path})` }}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                </div>

                {/* Tombol Back */}
                <div className="absolute top-4 left-4 z-30">
                    <Link 
                        to="/" 
                        className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition flex items-center gap-1 text-sm"
                    >
                        <IoIosArrowBack /> Back
                    </Link>
                </div>

                {/* Konten Detail di Atas Backdrop */}
                <div className="absolute top-[25vh] md:top-[35vh] left-0 right-0 px-4 md:px-10 z-20">
                    <div className="flex flex-col md:flex-row gap-8">
                        
                        {/* Poster */}
                        <div className="w-56 h-auto flex-shrink-0 mx-auto md:mx-0 -mt-16 md:-mt-24">
                            <img
                                src={film.poster_path ? `${POSTER_BASE}${film.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"}
                                alt={film.title}
                                className="w-full h-auto rounded-xl shadow-2xl border-4 border-white/10"
                            />
                        </div>

                        {/* Judul & Aksi */}
                        <div className="text-center md:text-left mt-4 md:mt-0 pt-0 bottom-10 md:pt-10 ">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-xl">{film.title}</h1>
                            
                            {film.tagline && (
                                <p className="text-xl italic text-gray-300 mt-1 mb-3">{film.tagline}</p>
                            )}
                            
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-white">
                                <span className="flex items-center text-lg font-semibold">
                                    <FaStar className="text-yellow-400 mr-1" /> {film.vote_average?.toFixed(1)}
                                </span>
                                <span className="text-lg font-semibold">
                                    | {film.release_date ? new Date(film.release_date).getFullYear() : 'N/A'}
                                </span>
                                <span className="flex items-center text-lg font-semibold">
                                    | <FaClock className="text-red-500 ml-2 mr-1" /> {formatRuntime(film.runtime)}
                                </span>
                            </div>
                            
                            {/* Aksi Tombol Trailer/Homepage */}
                            <div className="flex justify-center md:justify-start gap-4 mt-6">
                                {trailerKey ? (
                                    <a 
                                        href={`https://www.youtube.com/watch?v=${trailerKey}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className={primaryBtnClass}
                                    >
                                        <FaPlay /> Watch Trailer
                                    </a>
                                ) : (
                                    <button disabled className={`${primaryBtnClass} opacity-50 cursor-not-allowed`}>
                                        Trailer N/A
                                    </button>
                                )}
                                {film.homepage && (
                                    <a 
                                        href={film.homepage} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className={secondaryBtnClass}
                                    >
                                        <FaGlobe /> Website
                                    </a>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-10 -mt-10 md:mt-0 pb-12">
                {/* 2. Deskripsi Film (Berisi Overview dan Metadata) */}
                {/* 💡 Teruskan trailerKey agar DeskripsiFilm bisa menampilkan iframe */}
                <DeskripsiFilm film={film} trailerKey={trailerKey} theme={theme} /> 

                {/* 3. Casting (Teruskan data cast) */}
                <Casting filmId={film.id} theme={theme} /> 

                {/* 4. Similar Film (Teruskan data similar) */}
                <SimiliarFilm filmId={film.id} theme={theme} /> 

                {/* 5. Rating & Review Section */}
                <RatingReview filmId={film.id} theme={theme} />
            </div>
        </div>
    );
};

export default FilmDetailView;