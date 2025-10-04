import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../service/api";

const ListMovie = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("release_date.desc");
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const res = await api.get("/discover/movie", {
                params: { page, sort_by: sortBy },
            });
            setMovies(res.data.results);
            setTotalPages(res.data.total_pages);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMovies();
    }, [page, sortBy]);

    return (
        <div className="p-4 container mx-auto">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-red-900">
                    🎬 List Movies
                </h2>
                <select
                    value={sortBy}
                    onChange={(e) => {
                        setPage(1);
                        setSortBy(e.target.value);
                    }}
                    className="border px-2 py-1 rounded bg-black text-white border-red-900"
                >
                    <option value="release_date.desc">Terbaru → Terlama</option>
                    <option value="release_date.asc">Terlama → Terbaru</option>
                    <option value="vote_average.desc">Rating Tertinggi</option>
                    <option value="popularity.desc">Paling Populer</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-80">
                    <span className="loading loading-spinner loading-lg text-red-900"></span>
                </div>
            ) : (
                <div className="overflow-x-auto p-4 -mx-4">
                    <div className="carousel w-full space-x-4 pb-2">
                        {movies.map((movie) => {
                            const imageUrl = movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : movie.backdrop_path
                                ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                                : `https://via.placeholder.com/256x320?text=No+Image`;

                            const rating = movie.vote_average?.toFixed(1) || 'N/A';

                            return (
                                <div
                                    key={movie.id}
                                    // ✅ Ketinggian card dihapus/disederhanakan. Hanya w-64 yang diperlukan
                                    className="carousel-item w-64 relative bg-black text-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transform transition hover:scale-105 hover:-translate-y-2"
                                >
                                    <Link to={`/film/${movie.id}`} className="block h-full">
                                        <span className="absolute top-2 left-2 bg-red-900 text-xs px-2 py-1 rounded z-10">
                                            🎬 Movie
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
                                            <p className="text-yellow-400">⭐ {rating}</p>
                                            <p className="text-sm text-gray-400">
                                                Release: {movie.release_date || 'N/A'}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="flex justify-center mt-6 gap-2">
                <button
                    disabled={page === 1 || loading}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 bg-red-900 text-white rounded disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="text-red-900 font-bold flex items-center">
                    {page} / {totalPages}
                </span>
                <button
                    disabled={page === totalPages || loading}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 bg-red-900 text-white rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ListMovie;