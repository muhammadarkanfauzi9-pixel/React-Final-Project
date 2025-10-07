// src/components/Detail/SeriesDetail/SeriesDetailView.jsx (Presenter/View)

import React from "react";
// MENGUBAH: Tambahkan useNavigate. Pertahankan Link karena digunakan untuk Similar Series.
import { Link, useNavigate } from "react-router-dom"; 
// Impor ikon yang diperlukan
import { FaStar, FaHeart, FaCalendarAlt, FaGlobe, FaTag, FaIndustry, FaPlay } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';

const IMG_BASE = "https://image.tmdb.org/t/p/original";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500"; 

const SeriesDetailView = ({ series, trailerKey, cast, similar, theme, handleFavorite }) => {
    // MENAMBAH: Inisialisasi hook useNavigate
    const navigate = useNavigate();

    const themeClass = theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900";
    // CATATAN: detailBgClass (bg-gray-800/bg-white) tetap digunakan untuk semua detail block, KECUALI Similar Series di bawah.
    const detailBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
    const cardBgClass = theme === "dark" ? "bg-gray-700" : "bg-gray-200";

    // Style tombol utama
    const primaryBtnClass = "flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-[1.02]";
    const secondaryBtnClass = "flex items-center justify-center gap-2 bg-transparent border-2 border-red-700 hover:bg-red-700 hover:text-white text-red-700 font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300";

    return (
        <div className={`min-h-screen transition-colors duration-300 ${themeClass}`}>
            
            {/* 1. HERO SECTION & POSTER */}
            <div className="relative w-full h-auto pb-12">
                
                {/* Backdrop Image */}
                <div 
                    className="w-full h-[50vh] md:h-[65vh] bg-cover bg-center" 
                    style={{ backgroundImage: `url(${IMG_BASE}${series.backdrop_path})` }}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                </div>

                {/* Tombol Back (Lebih rapi di sudut atas kiri) */}
                <div className="absolute top-4 left-4 z-30">
                    <button 
                        onClick={() => navigate(-1)} // PERUBAHAN UTAMA: navigate(-1) untuk kembali ke halaman sebelumnya
                        className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition flex items-center gap-1 text-sm"
                        title="Kembali ke halaman sebelumnya"
                    >
                        <IoIosArrowBack /> Back
                    </button>
                </div>

                {/* Tombol Favorite (di kanan atas) */}
                <button
                    onClick={handleFavorite}
                    className="absolute top-4 right-4 z-30 bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                    title="Tambah/Hapus ke Favorite"
                >
                    <FaHeart className="text-xl" />
                </button>


                {/* Konten Detail di Atas Backdrop */}
                <div className="absolute top-[25vh] md:top-[35vh] left-0 right-0 px-4 md:px-10 z-20">
                    <div className="flex flex-col md:flex-row gap-8">
                        
                        {/* Poster */}
                        <div className="w-56 h-auto flex-shrink-0 mx-auto md:mx-0 -mt-16 md:-mt-24">
                            <img
                                src={series.poster_path ? `${POSTER_BASE}${series.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"}
                                alt={series.name}
                                className="w-full h-auto rounded-xl shadow-2xl border-4 border-white/10"
                            />
                        </div>

                        {/* Judul & Aksi */}
                        <div className="text-center md:text-left mt-4 md:mt-0 pt-0 md:pt-10">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-xl">{series.name}</h1>
                            
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-white">
                                <span className="flex items-center text-lg font-semibold">
                                    <FaStar className="text-yellow-400 mr-1" /> {series.vote_average?.toFixed(1)}
                                </span>
                                <span className="text-lg font-semibold">
                                    | {series.first_air_date ? new Date(series.first_air_date).getFullYear() : 'N/A'}
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
                                {series.homepage && (
                                    <a 
                                        href={series.homepage} 
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

            {/* Konten Bawah - Deskripsi dan Data Tambahan */}
            <div className="container mx-auto px-4 md:px-10 -mt-10 md:mt-0 pb-12">
                {/* Ringkasan, Trailer, Seasons, Casting (semua ini tetap menggunakan detailBgClass) */}
                <div className={`p-6 rounded-xl shadow-2xl ${detailBgClass}`}>
                    
                    {/* RINGKASAN & OVERVIEW (Deskripsi) */}
                    <div className="mb-8">
                        <h2 className={`text-2xl font-bold mb-3 ${theme === "dark" ? "text-red-600" : "text-red-900"}`}>
                            Overview
                        </h2>
                        <p className={`text-lg leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                            {series.overview || "No overview available for this series."}
                        </p>
                    </div>

                    {/* METADATA (Dibuat Grid Responsif) */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 border-t pt-6 border-base-200">
                        
                        <p className="text-sm">
                            <span className="font-semibold flex items-center gap-2"><FaCalendarAlt className="text-red-600"/> First Air Date:</span> 
                            {series.first_air_date}
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold flex items-center gap-2"><FaTag className="text-red-600"/> Status:</span> 
                            {series.status}
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold flex items-center gap-2"><FaStar className="text-yellow-400"/> Popularity:</span> 
                            {series.popularity?.toFixed(0)}
                        </p>
                        <p className="text-sm col-span-2 md:col-span-1">
                            <span className="font-semibold flex items-center gap-2"><FaGlobe className="text-red-600"/> Language:</span> 
                            {series.spoken_languages?.map(l => l.english_name).join(", ")}
                        </p>
                        <p className="text-sm col-span-2 md:col-span-3 lg:col-span-4">
                            <span className="font-semibold flex items-center gap-2"><FaIndustry className="text-red-600"/> Production Companies:</span> 
                            {series.production_companies?.map(c => c.name).filter(Boolean).join(" • ") || "N/A"}
                        </p>
                    </div>
                </div>

                {/* 2. TRAILER IFRAME */}
                {trailerKey && (
                    <div className={`mt-8 p-6 rounded-xl shadow-2xl ${detailBgClass}`}>
                        <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-red-600" : "text-red-900"}`}>
                            Official Trailer
                        </h3>
                        <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
                            <iframe
                                src={`https://www.youtube.com/embed/${trailerKey}`}
                                title={`${series.name} Trailer`}
                                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-xl"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}

                {/* 3. SEASONS (Tetap Grid) */}
                {series.seasons && series.seasons.length > 0 && (
                    <div className={`mt-8 p-6 rounded-xl shadow-2xl ${detailBgClass}`}>
                        <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-red-600" : "text-red-900"}`}>
                            📺 Seasons
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {series.seasons.map(season => (
                                <div key={season.id} className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-[1.05] ${cardBgClass}`}>
                                    <img
                                        src={season.poster_path ? `${POSTER_BASE}${season.poster_path}` : "https://via.placeholder.com/200x300?text=No+Image"}
                                        alt={season.name}
                                        className="w-full h-auto object-cover aspect-[2/3]"
                                    />
                                    <div className="p-2">
                                        <p className="text-sm font-semibold truncate">{season.name}</p>
                                        <p className="text-xs text-gray-400">{season.air_date ? new Date(season.air_date).getFullYear() : 'TBA'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. CASTING (Grid dengan Efek Hover) */}
                {cast.length > 0 && (
                    <div className={`mt-8 p-6 rounded-xl shadow-2xl ${detailBgClass}`}>
                        <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-red-600" : "text-red-900"}`}>
                            👥 Top Cast
                            {/* Styling ini sudah disesuaikan agar sama dengan komponen Casting yang di-request sebelumnya */}
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {cast.slice(0, 8).map(c => ( // Batasi tampilan 8 cast teratas
                                <div 
                                    key={c.id} 
                                    className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-[1.05] hover:shadow-xl cursor-pointer ${cardBgClass}`}
                                >
                                    <img
                                        src={c.profile_path ? `${POSTER_BASE}${c.profile_path}` : "https://via.placeholder.com/200x300?text=No+Image"}
                                        alt={c.original_name}
                                        className="w-full h-auto object-cover aspect-[2/3]"
                                    />
                                    <div className="p-2 text-xs text-center">
                                        <p className="font-semibold truncate">{c.original_name}</p>
                                        <p className="text-gray-500 truncate">{c.character}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. SIMILAR SERIES (Grid dengan Link Interaktif) - TELAH DISESUAIKAN */}
                {similar.length > 0 && (
                    <div 
                        // Container disesuaikan: p-4, bg-gray-100 (light), menghilangkan shadow
                        className={`mt-8 p-4 rounded-xl transition-colors duration-300 ${ 
                            theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900" 
                        }`}
                    >
                        {/* Judul disesuaikan: lebih kecil (text-lg) dan mb-3 */}
                        <h3 className="text-lg font-bold mb-3">
                            🎞️ Similar Series
                        </h3>
                        {/* Grid disesuaikan: maksimal 4 kolom pada md, gap-3 */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {similar.slice(0, 10).map(s => ( 
                                <Link 
                                    key={s.id} 
                                    to={`/series/${s.id}`} 
                                    // Link disesuaikan: menghilangkan shadow-md dan hover:shadow-red-600/50
                                    className={`rounded-lg overflow-hidden transition-transform hover:scale-105 ${cardBgClass}`}
                                >
                                    <img
                                        src={s.backdrop_path ? `${POSTER_BASE}${s.backdrop_path}` : "https://via.placeholder.com/500x281?text=No+Image"}
                                        alt={s.name}
                                        className="w-full h-32 object-cover"
                                    />
                                    <div className="p-2">
                                        {/* Judul disesuaikan: text-xs */}
                                        <p className="text-xs font-semibold truncate">{s.name}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SeriesDetailView;
