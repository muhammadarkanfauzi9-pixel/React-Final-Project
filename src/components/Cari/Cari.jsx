// src/components/Cari/Cari.jsx (Atau path yang sesuai)

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// 💡 ASUMSI: Impor hook tema dari path yang benar
import { useTheme } from "../../context/ThemeContext"; 

const Cari = () => {
    // 💡 TEMA: Ambil state tema dari context
    const { theme } = useTheme();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [popular, setPopular] = useState([]);
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notif, setNotif] = useState("");
    const [trailerKey, setTrailerKey] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const [zoomImage, setZoomImage] = useState(null);

    // Disederhanakan untuk penggunaan API yang Anda berikan
    const API_KEY = "a454e9001ac9227f9b651e0615092e47";
    const BASE_URL = "https://api.themoviedb.org/3";
    const IMG_URL = "https://image.tmdb.org/t/p/w500";

    // 💡 TEMA: Kelas dinamis berdasarkan tema
    const isDark = theme === "dark";

    const themeClasses = {
        // Latar belakang utama halaman
        bgPrimary: isDark ? "bg-gray-900" : "bg-gray-100",
        // Warna teks utama
        textPrimary: isDark ? "text-white" : "text-gray-900",
        // Warna latar belakang kartu/list
        bgSecondary: isDark ? "bg-gray-800" : "bg-white",
        // Warna teks sekunder (untuk detail kecil)
        textSecondary: isDark ? "text-gray-400" : "text-gray-600",
        // Kelas input dan border
        inputClass: isDark
            ? "border border-gray-600 bg-gray-700 text-white placeholder-gray-400"
            : "border border-gray-300 bg-white text-gray-900 placeholder-gray-500",
        // Kelas untuk tombol utama (Search/Trailer)
        buttonClass: "bg-red-500 text-white hover:bg-red-600",
    };

    // ... (fetchLists, handleSearch, getTrailer function tetap sama)

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const [popRes, trendRes] = await Promise.all([
                    axios.get(`${BASE_URL}/movie/popular`, {
                        params: { api_key: API_KEY, language: "en-US", page: 1 },
                    }),
                    axios.get(`${BASE_URL}/trending/movie/week`, {
                        params: { api_key: API_KEY, language: "en-US" },
                    }),
                ]);
                setPopular(popRes.data.results || []);
                setTrending(trendRes.data.results || []);
            } catch {
                setNotif("⚠ Gagal mengambil list awal.");
                setTimeout(() => setNotif(""), 3000);
            }
        };
        fetchLists();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setNotif("⚠ Masukkan kata kunci pencarian!");
            setTimeout(() => setNotif(""), 2500);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/search/movie`, {
                params: { api_key: API_KEY, query, language: "en-US" },
            });

            if (res.data.results.length === 0) {
                setNotif(`❌ Tidak ada hasil untuk "${query}"`);
                setResults([]);
                setTimeout(() => setNotif(""), 3000);
            } else {
                setResults(res.data.results || []);
            }
        } catch {
            setNotif("⚠ Gagal mengambil data. Coba lagi.");
            setTimeout(() => setNotif(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    const getTrailer = async (movieId) => {
        try {
            const res = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
                params: { api_key: API_KEY, language: "en-US" },
            });
            const trailer = res.data.results.find(
                (vid) => vid.site === "YouTube" && vid.type === "Trailer"
            );
            if (trailer) {
                setTrailerKey(trailer.key);
                setShowTrailer(true);
            } else {
                setNotif("⚠ Trailer tidak tersedia.");
                setTimeout(() => setNotif(""), 3000);
            }
        } catch {
            setNotif("⚠ Gagal memuat trailer.");
            setTimeout(() => setNotif(""), 3000);
        }
    };

    // 💡 TEMA: Hapus definisi class statis yang lama, gunakan objek themeClasses

    const HorizontalList = ({ title, data, withTrailer }) => (
        <div className="mb-6">
            <h2 className={`text-xl font-bold mb-2 ${themeClasses.textPrimary}`}>
                {title}
            </h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-2">
                {data.slice(0, 15).map((movie) => (
                    <div
                        key={movie.id}
                        className={`min-w-[250px] ${themeClasses.bgSecondary} ${themeClasses.textPrimary} rounded-lg shadow-md overflow-hidden transition-transform duration-500 hover:scale-105`}
                    >
                        <Link to={`/film/${movie.id}`}>
                            {movie.poster_path ? (
                                <img
                                    src={`${IMG_URL}${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-64 object-cover cursor-pointer"
                                />
                            ) : (
                                <div className="w-full h-64 bg-gray-500 flex items-center justify-center">
                                    <span>No Image</span>
                                </div>
                            )}
                        </Link>
                        <div className="p-3">
                            <Link to={`/film/${movie.id}`}>
                                <h3 className="text-sm font-semibold truncate">
                                    {movie.title}{" "}
                                    <span className={themeClasses.textSecondary + " text-xs"}>
                                        ({movie.original_title})
                                    </span>
                                </h3>
                            </Link>
                            <p className={`text-xs mb-1 ${themeClasses.textSecondary}`}>
                                📅 {movie.release_date || "Unknown"} | ⭐{" "}
                                {movie.vote_average?.toFixed(1) || "-"}
                            </p>
                            <p className="text-xs text-gray-300 line-clamp-3 mb-2">
                                {movie.overview || "Tidak ada deskripsi"}
                            </p>
                            {withTrailer && (
                                <button
                                    onClick={() => getTrailer(movie.id)}
                                    className={`w-full mt-2 text-xs px-2 py-1 rounded ${themeClasses.buttonClass}`}
                                >
                                    🎥 Lihat Trailer
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className={`px-4 ${themeClasses.bgPrimary} min-h-screen ${themeClasses.textPrimary} pb-10`}>
            {/* notif */}
            {notif && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg shadow-lg z-50">
                    {notif}
                </div>
            )}

            {/* search */}
            <form
                onSubmit={handleSearch}
                className="flex justify-center gap-2 mb-6 pt-6"
            >
                <input
                    type="text"
                    placeholder="Cari film..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={`rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-red-500 ${themeClasses.inputClass}`}
                />
                <button
                    type="submit"
                    className={`font-semibold px-6 py-2 rounded-lg transition ${themeClasses.buttonClass}`}
                >
                    🔍 Search
                </button>
            </form>

            {/* loading */}
            {loading && <p className="text-center">⏳ Sedang mencari...</p>}

            {/* hasil pencarian */}
            {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {results.map((movie) => (
                        <div
                            key={movie.id}
                            className={`${themeClasses.bgSecondary} ${themeClasses.textPrimary} rounded-lg shadow-md overflow-hidden transition-transform duration-500 hover:scale-105`}
                        >
                            <Link to={`/film/${movie.id}`}>
                                {movie.backdrop_path || movie.poster_path ? (
                                    <img
                                        src={`${IMG_URL}${movie.backdrop_path || movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-full h-56 object-cover cursor-pointer"
                                    />
                                ) : (
                                    <div className="w-full h-56 bg-gray-500 flex items-center justify-center">
                                        <span>No Image</span>
                                    </div>
                                )}
                            </Link>
                            <div className="p-3">
                                <Link to={`/film/${movie.id}`}>
                                    <h2 className="text-base font-bold mb-1 truncate">
                                        {movie.title}{" "}
                                        <span className={themeClasses.textSecondary + " text-sm"}>
                                            ({movie.original_title})
                                        </span>
                                    </h2>
                                </Link>
                                <p className={`text-xs mb-1 ${themeClasses.textSecondary}`}>
                                    📅 {movie.release_date || "Unknown"} | ⭐{" "}
                                    <span className="font-semibold">
                                        {movie.vote_average?.toFixed(1) || "-"}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-200 line-clamp-1 mb-2">
                                    {movie.overview || "Tidak ada deskripsi untuk film ini."}
                                </p>
                                <button
                                    onClick={() => getTrailer(movie.id)}
                                    className={`mt-2 w-full text-sm py-1 px-2 rounded ${themeClasses.buttonClass}`}
                                >
                                    🎥 Lihat Trailer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <HorizontalList title="🔥 Popular Movies" data={popular} withTrailer />
                    <HorizontalList
                        title="📈 Trending Movies"
                        data={trending}
                        withTrailer
                    />
                </>
            )}

            {/* modal trailer (tetap sama) */}
            {showTrailer && trailerKey && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
                    <div className="relative w-11/12 md:w-3/4 lg:w-2/3">
                        <iframe
                            width="100%"
                            height="500"
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&modestbranding=1&rel=0`}
                            title="Trailer"
                            frameBorder="0"
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg shadow-lg"
                        ></iframe>
                        <button
                            onClick={() => setShowTrailer(false)}
                            className="absolute -top-10 right-0 text-white text-3xl font-bold"
                        >
                            ✖
                        </button>
                    </div>
                </div>
            )}

            {/* modal zoom gambar (tetap sama) */}
            {zoomImage && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
                    onClick={() => setZoomImage(null)}
                >
                    <img
                        src={zoomImage}
                        alt="Zoom"
                        className="max-w-full max-h-full rounded-lg shadow-lg transform scale-95 transition-transform duration-300 ease-in-out hover:scale-100"
                    />
                    <button
                        className="absolute top-6 right-6 text-white text-3xl font-bold"
                        onClick={() => setZoomImage(null)}
                    >
                        ✖
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cari;