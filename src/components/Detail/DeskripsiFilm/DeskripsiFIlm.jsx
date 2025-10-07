// src/components/Detail/DeskripsiFilm/DeskripsiFilm.jsx

import React from 'react';
import { FaCalendarAlt, FaTag, FaStar, FaGlobe, FaIndustry } from 'react-icons/fa';

// Sekarang menerima film, trailerKey, dan theme sebagai props
const DeskripsiFilm = ({ film, trailerKey, theme }) => {
    
    const detailBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";

    return (
        <div className={`mt-8 p-6 rounded-xl shadow-2xl ${detailBgClass}`}>
            
            {/* OVERVIEW (Deskripsi) */}
            <div className="mb-8">
                <h2 className={`text-2xl font-bold mb-3 ${theme === "dark" ? "text-red-600" : "text-red-900"}`}>
                    Overview
                </h2>
                <p className={`text-lg leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {film.overview || "No overview available for this movie."}
                </p>
            </div>

            {/* METADATA (Dibuat Grid Responsif) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 border-t pt-6 border-base-200">
                
                <p className="text-sm">
                    <span className="font-semibold flex items-center gap-2"><FaCalendarAlt className="text-red-600"/> Release Date:</span> 
                    {film.release_date}
                </p>
                <p className="text-sm">
                    <span className="font-semibold flex items-center gap-2"><FaTag className="text-red-600"/> Status:</span> 
                    {film.status}
                </p>
                <p className="text-sm">
                    <span className="font-semibold flex items-center gap-2"><FaStar className="text-yellow-400"/> Popularity:</span> 
                    {film.popularity?.toFixed(0)}
                </p>
                <p className="text-sm">
                    <span className="font-semibold flex items-center gap-2"><FaGlobe className="text-red-600"/> Language:</span> 
                    {film.spoken_languages?.map(l => l.english_name).join(", ")}
                </p>
                <p className="text-sm col-span-2 md:col-span-3 lg:col-span-4">
                    <span className="font-semibold flex items-center gap-2"><FaIndustry className="text-red-600"/> Production Companies:</span> 
                    {film.production_companies?.map(c => c.name).filter(Boolean).join(" • ") || "N/A"}
                </p>
            </div>

            {/* TRAILER IFRAME (Dipindahkan ke dalam DeskripsiFilm) */}
            {trailerKey && (
                <div className={`mt-8 pt-6 border-t border-base-200`}>
                    <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-red-600" : "text-red-900"}`}>
                        Official Trailer
                    </h3>
                    <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
                        <iframe
                            src={`https://www.youtube.com/embed/${trailerKey}`}
                            title={`${film.title} Trailer`}
                            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-xl"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default DeskripsiFilm;