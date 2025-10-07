// src/components/Rate/RateButton.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

/**
 * Komponen tombol Rating untuk film atau serial.
 * Catatan: Ini mengasumsikan Anda sudah memiliki TMDB API Key 
 * di file .env dengan nama VITE_KEY_TMDB dan sudah terhubung dengan Redux 
 * untuk status login (isLoggedIn) dan session ID (sessionId).
 */
const RateButton = ({ mediaType, mediaId, isLoggedIn, sessionId }) => {
    const [rating, setRating] = useState(0);
    const [isRated, setIsRated] = useState(false);
    const [error, setError] = useState(null);

    // Ambil TMDB V3 API Key dari environment variable
    const TMDB_V3_API_KEY = import.meta.env.VITE_KEY_TMDB; 
    
    // Status kesiapan untuk memberikan rating (harus login dan punya session ID)
    const isReadyToRate = isLoggedIn && sessionId;

    const handleRatingSubmit = async (value) => {
        if (!isReadyToRate) {
            alert("Anda harus login terlebih dahulu untuk memberikan rating.");
            return;
        }

        // TMDB API endpoint untuk rating
        const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/rating?api_key=${TMDB_V3_API_KEY}&session_id=${sessionId}`;
        
        try {
            // TMDB menggunakan skala 1-10. Kita kirim 5 bintang * 2 = 10.
            const response = await axios.post(
                url,
                { value: value * 2 }, // Mengubah rating 1-5 menjadi skala 2-10
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.success) {
                setRating(value);
                setIsRated(true);
                setError(null);
                alert(`Rating ${value}/5 berhasil dikirim!`);
            } else {
                setError("Gagal mengirim rating. Session mungkin kedaluwarsa.");
            }
        } catch (err) {
            console.error("Error rating:", err);
            setError("Gagal berkomunikasi dengan server TMDB. Pastikan Session ID dan Key benar.");
        }
    };

    // Tampilkan pesan jika belum login
    if (!isLoggedIn) {
        return (
            <div className="text-sm text-gray-400 p-2 bg-gray-800 rounded-lg shadow mt-4">
                <p>⭐ Anda harus **Login** untuk memberikan rating!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-start gap-2 p-4 bg-gray-800 rounded-xl shadow-lg w-full max-w-sm mt-4">
            <h4 className="text-lg font-semibold text-white">
                {isRated ? `Rating Anda: ${rating}/5` : 'Beri Rating (1-5)'}
            </h4>
            <div className="flex gap-1 text-2xl">
                {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                        <FaStar
                            key={index}
                            className={`cursor-pointer transition-colors duration-200 ${
                                ratingValue <= rating 
                                    ? 'text-yellow-500' 
                                    : 'text-gray-600'
                            } hover:text-yellow-400`}
                            onClick={() => handleRatingSubmit(ratingValue)}
                        />
                    );
                })}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default RateButton;