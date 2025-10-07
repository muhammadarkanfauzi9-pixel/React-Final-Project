import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../service/api";
import { useTheme } from "../../../context/ThemeContext";

const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500"; 

const ListSeries = () => {
    const [series, setSeries] = useState([]);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("first_air_date.desc");
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();

    const bgColor = theme === 'dark' ? 'from-base-100' : 'from-base-100'; // Sesuaikan jika 'base-100' berubah berdasarkan tema

    const fetchSeries = async () => {
        setLoading(true);
        try {
            const res = await api.get("/discover/tv", {
                params: { page, sort_by: sortBy },
            });
            setSeries(res.data.results);
            setTotalPages(res.data.total_pages);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSeries();
    }, [page, sortBy]);

    const renderCard = (serie) => {
        const imageUrl = serie.poster_path
            ? `${IMG_BASE_URL}${serie.poster_path}`
            : `https://via.placeholder.com/256x384?text=No+Image`;
        
        const rating = serie.vote_average?.toFixed(1) || 'N/A';
        const title = serie.original_name;
        const overview = serie.overview;

        return (
            <div
                key={serie.id}
                className="carousel-item w-64 relative rounded-lg overflow-hidden shadow-md transform transition duration-300
                           group hover:scale-[1.03] hover:shadow-2xl hover:shadow-red-600/50"
            >
                <Link 
                    to={`/series/${serie.id}`} 
                    className="block relative w-full h-full"
                >
                    {/* Image */}
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover rounded-lg aspect-[2/3]" 
                        onError={(e) => { e.target.src = `https://via.placeholder.com/256x384?text=Error+Loading`; }}
                    />
                    
                    {/* Tag Header */}
                    <span className="absolute top-0 left-0 bg-red-900 text-xs px-2 py-1 rounded-br-lg z-10 text-white font-semibold">
                        Series
                    </span>
                    
                    {/* Overlay Interaktif Saat Hover (Tanpa ikon play) */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                        <h3 className="text-xl font-extrabold mb-1 line-clamp-2">{title}</h3>
                        <p className="text-yellow-400 text-lg flex items-center mb-2">
                            <span className="mr-1">⭐</span> {rating}
                        </p>
                        <p className="text-sm text-gray-300 line-clamp-3">
                            {overview || "No overview available."}
                        </p>
                    </div>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 container mx-auto">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-red-900">
                    📺 List Series
                </h2>
                <select
                    value={sortBy}
                    onChange={(e) => {
                        setPage(1);
                        setSortBy(e.target.value);
                    }}
                    className="border px-2 py-1 rounded bg-black text-white border-red-900"
                >
                    <option value="first_air_date.desc">Terbaru → Terlama</option>
                    <option value="first_air_date.asc">Terlama → Terbaru</option>
                    <option value="vote_average.desc">Rating Tertinggi</option>
                    <option value="popularity.desc">Paling Populer</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-80">
                    <span className="loading loading-spinner loading-lg text-red-900"></span>
                </div>
            ) : (
                <>
                    <div className="relative">
                        {/* GRADIENT KIRI */}
                        <div
                            className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r ${bgColor} to-transparent pointer-events-none z-10`}
                        />
                        
                        {/* GRADIENT KANAN */}
                        <div
                            className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l ${bgColor} to-transparent pointer-events-none z-10`}
                        />
                        
                        <div className="overflow-x-auto scroll-smooth pb-2 px-4">
                            <div className="flex space-x-6 relative z-0">
                                {series.map(renderCard)}
                            </div>
                        </div>
                    </div>
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
                </>
            )}
        </div>
    );
};

export default ListSeries;