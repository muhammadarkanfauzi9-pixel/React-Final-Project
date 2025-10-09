// src/components/Detail/FilmDetail/FilmDetail.jsx

import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FilmDetailView from "./FilmDetailView"; // Tetap impor FilmDetailView
import { detailReducer, initialState } from "../../reducer/detailReducer";
import { useDispatch } from "react-redux"; // Tambahkan useSelector untuk mengambil tema
import { addFavorite } from "../../reducer/favoriteReducer";
// Import useTheme jika Anda menggunakannya di luar Redux untuk mendapatkan tema
import { useTheme } from "../../context/ThemeContext"; 


const FilmDetail = () => {
    const { id } = useParams();
    const [state, localDispatch] = useReducer(detailReducer, initialState);
    const reduxDispatch = useDispatch();
    
    // Asumsi tema diambil dari ThemeContext     (atau sesuaikan jika dari Redux)
    const { theme } = useTheme(); 
    
    // Tambahkan cast dan similar ke destructuring state
    const { film, trailerKey, cast, similar, loading, error } = state; 
    
    const API_BASE_URL = "https://api.themoviedb.org/3/movie";
    const API_KEY = import.meta.env.VITE_KEY_TMDB;
    const authHeaders = {
        accept: "application/json",
        Authorization: "Bearer " + API_KEY,
    };

    useEffect(() => {
        const fetchFilmData = async () => {
            localDispatch({ type: "LOADING" });
            try {
                // Fetch detail, videos, credits (cast), dan similar movies secara paralel
                const [detailRes, videosRes, creditsRes, similarRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/${id}`, { headers: authHeaders }),
                    axios.get(`${API_BASE_URL}/${id}/videos`, { headers: authHeaders }),
                    axios.get(`${API_BASE_URL}/${id}/credits`, { headers: authHeaders }),
                    axios.get(`${API_BASE_URL}/${id}/similar`, { headers: authHeaders }),
                ]);

                const trailer = videosRes.data.results.find(
                    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
                );

                localDispatch({
                    type: "SUCCESS",
                    payload: { 
                        film: detailRes.data, 
                        trailerKey: trailer ? trailer.key : null,
                        cast: creditsRes.data.cast.filter(c => c.profile_path).slice(0, 10),
                        similar: similarRes.data.results,
                    },
                });
            } catch (err) {
                console.error("❌ Gagal fetch detail film:", err);
                localDispatch({ type: "ERROR", payload: err.message });
            }
        };

        if (id) fetchFilmData();
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }, [id]);

    const handleFavorite = () => {
        if (film) {
            reduxDispatch(addFavorite({...film, media_type: 'movie'}, "films")); 
            alert(`🎉 ${film.title} ditambahkan ke Favorite!`);
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg text-red-700"></span></div>;
    
    if (error) return <p className="text-center text-red-500 py-10">Error: Gagal memuat detail film. Coba refresh.</p>;
    
    if (!film) return null;

    return (
      <div className="relative">
        {/* Tombol Favorite Dikeluarkan dari View, dan Diteruskan Fungsinya */}
        <button
          onClick={handleFavorite}
          className="absolute top-4 right-6 z-30 bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
          title="Tambah ke Favorite"
        >
          ❤️
        </button>

        {/* Komponen view film detail */}
        <FilmDetailView 
            film={film} 
            trailerKey={trailerKey} 
            cast={cast || []} // Teruskan data cast
            similar={similar || []} // Teruskan data similar
            theme={theme} // Teruskan tema
            // handleFavorite tidak lagi dibutuhkan di view karena tombolnya di sini
        />
      </div>
    );
};

export default FilmDetail;