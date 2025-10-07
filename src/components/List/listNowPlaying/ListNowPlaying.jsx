import React, { useEffect, useState } from "react";
import api from "../../../service/api";
import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500"; 

const ListNowPlaying = () => {
    const [nowPlaying, setNowPlaying] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    const bgColor = theme === 'dark' ? 'from-base-100' : 'from-base-100'; // Sesuaikan jika 'base-100' berubah berdasarkan tema

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

    const renderCard = (movie) => {
        const rating = movie.vote_average?.toFixed(1) || 'N/A';
        const title = movie.original_title;
        const overview = movie.overview;
        const imageUrl = movie.poster_path
            ? `${IMG_BASE_URL}${movie.poster_path}`
            : `https://via.placeholder.com/256x384?text=No+Image`;

        return (
            <div
                key={movie.id}
                className="carousel-item w-64 relative rounded-lg overflow-hidden shadow-md transform transition duration-300
                           group hover:scale-[1.03] hover:shadow-2xl hover:shadow-red-600/50"
            >
                <Link 
                    to={`/film/${movie.id}`} 
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
                        Now Playing
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
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-red-900">
                🎞️ Now Playing
            </h2>

            {loading ? (
                <div className="flex justify-center items-center h-80">
                    <span className="loading loading-spinner loading-lg text-red-900"></span>
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
                        <div className="carousel w-full space-x-4 pb-2">
                            {nowPlaying.map(renderCard)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListNowPlaying;