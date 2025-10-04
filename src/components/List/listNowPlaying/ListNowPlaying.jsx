import React, { useEffect, useState } from "react";
import api from "../../../service/api";
import { Link } from "react-router-dom";

const ListNowPlaying = () => {
    const [nowPlaying, setNowPlaying] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNowPlaying = async () => {
            setLoading(true);
            try {
                const res = await api.get("/movie/now_playing");
                setNowPlaying(res.data.results);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchNowPlaying();
    }, []);

    return (
        <div className="p-4 container mx-auto">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-red-900">
                🎞️ Now Playing
            </h2>

            {loading ? (
                <div className="flex justify-center items-center h-80">
                    <span className="loading loading-spinner loading-lg text-red-900"></span>
                </div>
            ) : (
                <div className="overflow-x-auto p-4 -mx-4">
                    <div className="carousel w-full space-x-4 pb-2">
                        {nowPlaying.map((movie) => {
                            const imageUrl = movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : movie.backdrop_path
                                ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                                : `https://via.placeholder.com/256x320?text=No+Image`;

                            return (
                                <div
                                    key={movie.id}
                                    // ✅ Ketinggian card dihapus/disederhanakan. Hanya w-64 yang diperlukan
                                    className="carousel-item w-64 relative bg-black text-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transform transition hover:scale-105 hover:-translate-y-2"
                                >
                                    <Link to={`/film/${movie.id}`} className="block h-full">
                                        <span className="absolute top-2 left-2 bg-red-900 text-xs px-2 py-1 rounded z-10">
                                            🎞️ Now Playing
                                        </span>
                                        <img
                                            src={imageUrl}
                                            alt={movie.original_title}
                                            // Ketinggian gambar sudah benar (h-80)
                                            className="rounded-t-lg w-80 h-80 object-cover transition-transform duration-300 hover:scale-110" 
                                            onError={(e) => { e.target.src = `https://via.placeholder.com/256x320?text=Error+Loading`; }}
                                        />
                                        <div className="p-3">
                                            {/* ✅ PERBAIKAN: Hapus class 'truncate' agar judul wrap */}
                                            <h3 className="font-bold line-clamp-2">{movie.original_title}</h3>
                                            <p className="text-yellow-400">⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</p>
                                            <p className="text-sm text-gray-400">{movie.release_date || 'N/A'}</p>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListNowPlaying;