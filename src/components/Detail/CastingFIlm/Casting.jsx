// src/components/Detail/CastingFilm/Casting.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const IMG_BASE = "https://image.tmdb.org/t/p/w200";
const API_KEY = import.meta.env.VITE_KEY_TMDB;

/**
 * Komponen yang memuat dan menampilkan daftar 10 pemeran utama film (cast).
 */
const Casting = ({ filmId, theme }) => {
    // === STATE MANAGEMENT ===
    const [cast, setCast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mendefinisikan class untuk background kartu cast (sesuai SeriesDetailView)
    const cardBgClass = theme === "dark" ? "bg-gray-700" : "bg-gray-200";

    // === LOGIKA PENGAMBILAN DATA (Fetch) ===
    const fetchCast = useCallback(async () => {
        if (!filmId) return;

        setLoading(true);
        setError(null);
        try {
            const castRes = await axios.get(
                `https://api.themoviedb.org/3/movie/${filmId}/credits`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: "Bearer " + API_KEY,
                    },
                }
            );
            setCast(castRes.data.cast.slice(0, 10)); // Ambil 10 pemeran utama
        } catch (err) {
            console.error("Gagal mengambil data pemeran:", err);
            setError("Gagal memuat data pemeran. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    }, [filmId]);

    useEffect(() => {
        fetchCast();
    }, [fetchCast]);

    // === LOGIKA RENDERING KONDISIONAL ===

    // Catatan: Styling Loading/Error dan No Cast di bawah sudah disesuaikan agar terlihat konsisten dengan SeriesDetailView
    if (loading) {
        return (
            <div className={`p-6 mt-8 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Memuat daftar pemeran...
            </div>
        );
    }

    if (error) {
        return (
            <div className={`p-6 mt-8 text-center text-red-500`}>
                {error}
            </div>
        );
    }

    // Jika tidak ada cast, tampilkan pesan
    if (cast.length === 0) {
        return (
            <div
                className={`p-6 mt-8 rounded-xl transition-colors duration-300 ${
                    theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-white text-gray-600 shadow-2xl"
                }`}
            >
                <h3 className={`text-2xl font-bold mb-3 ${theme === "dark" ? "text-red-600" : "text-red-900"}`}>👥 Top Cast</h3>
                <p className="text-sm">Data pemeran tidak tersedia untuk film ini.</p>
            </div>
        );
    }

    // === RENDER UTAMA: Tampilan Grid Casting ===
    return (
        // Mengganti div container mx-auto dengan styling detail block dari SeriesDetailView
        <div
            className={`mt-8 p-6 rounded-xl shadow-2xl transition-colors duration-300 ${
                // Menggunakan bg-white untuk light mode (sesuai SeriesDetailView detailBgClass)
                theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
            }`}
        >
            {/* Judul disesuaikan */}
            <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-red-600" : "text-red-900"}`}>
                👥 Top Cast
            </h3>
            {/* Grid disesuaikan agar lebih rapat dan sesuai SeriesDetailView */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {cast.map(c => (
                    <div
                        key={c.id}
                        // Class kartu disesuaikan agar match SeriesDetailView
                        className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-[1.05] hover:shadow-xl cursor-pointer ${cardBgClass}`}
                    >
                        <img
                            src={c.profile_path ? `${IMG_BASE}${c.profile_path}` : "https://via.placeholder.com/200x300?text=No+Image"}
                            alt={c.original_name}
                            // Class gambar disesuaikan agar menggunakan rasio 2/3
                            className="w-full h-auto object-cover aspect-[2/3]"
                        />
                        <div className="p-2 text-xs text-center">
                            <p className="font-semibold truncate">{c.original_name}</p>
                            {/* Warna teks karakter disesuaikan ke text-gray-500 */}
                            <p className="text-gray-500 truncate">{c.character}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Casting;
