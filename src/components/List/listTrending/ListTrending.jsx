import React, { useEffect, useState } from "react";
import api from "../../../service/api";
import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";

const ListTrending = () => {
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    const textPrimary = "text-base-content"; 
    const bgColor = theme === 'dark' ? 'from-base-100' : 'from-base-100'; // Sesuaikan jika 'base-100' berubah berdasarkan tema

    useEffect(() => {
        const fetchTrending = async () => {
            setLoading(true);
            try {
                const res = await api.get("/trending/all/day"); 
                // Filter out 'person' type
                setTrending(res.data.results.filter(item => item.media_type !== "person"));
            } catch (err) {
                console.error("Error fetching trending data:", err);
            }
            setLoading(false);
        };
        fetchTrending();
    }, []);

    const renderCard = (item) => {
        const isMovie = item.media_type === "movie";
        const title = item.original_title || item.original_name || item.name;
        const rating = item.vote_average?.toFixed(1) || 'N/A';
        const mediaLabel = isMovie ? 'Film' : (item.media_type === 'tv' ? 'Series' : 'Trending');
        const overview = item.overview;
        
        const imageUrl = item.poster_path 
            ? `${IMG_BASE_URL}${item.poster_path}`
            : `https://via.placeholder.com/256x384?text=No+Image`; 
        
        const linkPath = isMovie ? `/film/${item.id}` : `/series/${item.id}`;

        return (
            <div
                key={item.id}
                className={`carousel-item w-64 relative rounded-lg overflow-hidden shadow-md transform transition duration-300
                           group hover:scale-[1.03] hover:shadow-2xl hover:shadow-red-600/50`}
            >
                <Link 
                    to={linkPath} 
                    className="block relative w-full h-full"
                >
                    {/* Image */}
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover rounded-lg aspect-[2/3]"
                        onError={(e) => { e.target.src = `https://via.placeholder.com/256x384?text=Error+Loading`; }}
                    />
                    
                    {/* Overlay Header */}
                    <span className="absolute top-0 left-0 bg-red-600 text-xs px-2 py-1 rounded-br-lg z-10 text-white font-semibold">
                        {mediaLabel}
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
    };

    return (
        <div className="p-4 container mx-auto">
            <h2 className={`text-3xl font-bold flex items-center gap-2 mb-6 ${textPrimary}`}>
                🔥 Trending Now
            </h2>

            {loading ? (
                <div className="flex justify-center items-center h-80">
                    <span className="loading loading-spinner loading-lg text-red-600"></span>
                </div>
            ) : (
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
                            {trending.map(renderCard)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListTrending;