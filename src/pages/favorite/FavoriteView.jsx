import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { removeFavorite } from "../../reducer/favoriteReducer";

const FavoriteView = () => {
    const dispatch = useDispatch();
    const { films, series } = useSelector((state) => state.favorite);
    const { theme } = useTheme();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    const handleRemove = (id, type) => {
        const typeText = type === "films" ? "movie" : "series";
        const confirmDelete = window.confirm(`Yakin menghapus ${typeText} dari favorit?`);

        if (confirmDelete) {
            dispatch(removeFavorite(id, type));
        }
    };

    // Kelas tema
    const bgPrimary = "bg-base-100"; 
    const textPrimary = "text-base-content";
    const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
    const accentColor = "text-red-600";

    // --- RENDER CARD FILM/SERIES (Glow Merata, Tombol Hapus Ikonik, Tanpa Ikon Play di Overlay) ---
    const renderCard = (item, type) => {
        const path = type === "film" ? `/film/${item.id}` : `/series/${item.id}`;
        const title = item.original_title || item.title || item.name || item.original_name;
        const rating = item.vote_average?.toFixed(1) || 'N/A';
        const mediaLabel = type === "film" ? 'Film' : 'Series';

        const imageUrl = item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : `https://via.placeholder.com/256x384?text=No+Image`;

        return (
            <div
                key={`${type}-${item.id}`}
                className="carousel-item w-64 relative rounded-lg overflow-hidden shadow-md transform transition duration-300
                           group hover:scale-[1.03] hover:shadow-2xl hover:shadow-red-600/50"
            >
                {/* 🔴 TOMBOL HAPUS IKONIK (Muncul saat hover) */}
                <button
                    onClick={(e) => {
                        e.preventDefault(); 
                        handleRemove(item.id, type === "film" ? "films" : "series");
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-700 hover:bg-red-800 text-white rounded-full z-20 
                               opacity-0 group-hover:opacity-100 transition duration-300 shadow-lg"
                    title="Hapus dari Favorit"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>


                <Link
                    to={path}
                    className="block relative w-full h-full"
                >
                    {/* Image */}
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover rounded-lg aspect-[2/3]"
                        onError={(e) => { e.target.src = `https://via.placeholder.com/256x384?text=No+Image`; }}
                    />

                    {/* Overlay Header */}
                    <span className="absolute top-0 left-0 bg-red-600 text-xs px-2 py-1 rounded-br-lg z-10 text-white font-semibold">
                        {mediaLabel}
                    </span>

                    {/* Overlay Interaktif Saat Hover (DENGAN DESKRIPSI) */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                        <h3 className="text-xl font-extrabold mb-1 line-clamp-2">{title}</h3>
                        <p className="text-yellow-400 text-lg flex items-center mb-2">
                            <span className="mr-1">⭐</span> {rating}
                        </p>
                        
                        {/* Deskripsi/Overview DITAMPILKAN di sini */}
                        <p className="text-sm text-gray-300 line-clamp-3 mb-3">
                            {item.overview || "No overview available."}
                        </p>
                        
                        <p className="text-xs text-gray-400">
                            {item.release_date
                                ? `Rilis: ${item.release_date}`
                                : `Tayang Perdana: ${item.first_air_date}`}
                        </p>

                        {/* Ikon Play Besar dihilangkan dari sini! */}
                        
                    </div>
                </Link>
            </div>
        );
    };

    const renderSection = (items, title, type) => (
        <div className="mb-12 relative">
            <h3 className={`text-2xl font-bold mb-4 ${accentColor}`}>{title}</h3>

            {items.length === 0 ? (
                <p className={`${textSecondary}`}>Belum ada {type} favorit yang ditambahkan.</p>
            ) : (
                <div className="relative">
                    
                    {/* Gradient kiri & kanan disesuaikan dengan tema */}
                    <div
                        className={`absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-base-100 to-transparent pointer-events-none z-10`}
                    />
                    <div
                        className={`absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-base-100 to-transparent pointer-events-none z-10`}
                    />

                    <div className="overflow-x-auto scroll-smooth pb-4 px-2">
                        <div className="flex space-x-6 relative z-0">
                            {items.map((item) => renderCard(item, type))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className={`flex justify-center items-center min-h-screen ${bgPrimary} ${textPrimary}`}>
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-t-transparent border-red-600 rounded-full animate-spin mb-3"></div>
                    <p className="text-lg font-semibold">Memuat favoritmu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative px-6 py-6 min-h-screen ${bgPrimary} ${textPrimary}`}>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-red-600">Favorit Saya</h1>
            <h2 className={`text-lg md:text-xl font-medium mb-8 ${textPrimary}`}>
                Film & Series favoritmu tersimpan di sini.
            </h2>

            {renderSection(films, "🎬 Film Favorit", "film")}
            {renderSection(series, "📺 Series Favorit", "series")}
        </div>
    );
};

export default FavoriteView; // Export
