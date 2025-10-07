import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Base URL untuk gambar TMDB
const IMG_BASE = "https://image.tmdb.org/t/p/w200"; 
// Pastikan VITE_KEY_TMDB tersedia di environment Anda
const API_KEY = import.meta.env.VITE_KEY_TMDB; 

// Komponen Casting menerima filmId dan theme sebagai props
const Casting = ({ filmId, theme }) => {
    const [cast, setCast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fungsi untuk mengambil data pemeran
    const fetchCast = useCallback(async () => {
        if (!filmId) return;

        setLoading(true);
        setError(null);
        try {
            const castRes = await axios.get(
                // Menggunakan endpoint /movie/ karena ini adalah Detail Film
                `https://api.themoviedb.org/3/movie/${filmId}/credits`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: "Bearer " + API_KEY,
                    },
                }
            );
            // Ambil 10 pemeran pertama
            setCast(castRes.data.cast.slice(0, 10));
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


    // ----------------------------------------------------
    // Rendering Logic (Loading/Error States)
    // ----------------------------------------------------

    if (loading) {
        return (
            <div className={`p-6 m-4 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Memuat daftar pemeran...
            </div>
        );
    }

    if (error) {
        return (
            <div className={`p-6 m-4 text-center text-red-500`}>
                {error}
            </div>
        );
    }

    // ----------------------------------------------------
    // JSX Tampilan Casting dengan Efek Hover
    // ----------------------------------------------------

    // Tambahkan div container mx-auto agar terlihat rapi di tengah
    return (
        <div className="container mx-auto">
            {cast.length > 0 && (
                <div 
                    className={`p-6 m-4 rounded-xl shadow-md transition-colors duration-300 ${
                        theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"
                    }`}
                >
                    <h3 className="text-lg font-bold mb-3">👥 Casting</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {cast.map(c => (
                            <div 
                                key={c.id} 
                                // ✨ EFEK RESPONSIF DITAMBAHKAN DI SINI
                                className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-[1.05] hover:shadow-xl cursor-pointer ${
                                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                                }`}
                            >
                                <img
                                    src={c.profile_path ? `${IMG_BASE}${c.profile_path}` : "https://via.placeholder.com/200x300?text=No+Image"}
                                    alt={c.original_name}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-2 text-xs">
                                    <p className="font-semibold truncate">{c.original_name}</p>
                                    <p className="text-gray-400 truncate">{c.character}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Casting; 