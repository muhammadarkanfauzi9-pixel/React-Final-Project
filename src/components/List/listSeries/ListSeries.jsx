// src/components/List/listSeries/ListSeries.jsx

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

    // --- Perubahan Warna dan Tema ---
    // Sesuaikan dengan ListTrending:
    const textPrimary = "text-base-content"; 
    const bgColor = theme === 'dark' ? 'from-base-100' : 'from-base-100'; 
    const btnClass = "bg-red-700 text-white"; // Warna solid untuk tombol
    // ---------------------------------

    const fetchSeries = async () => {
        setLoading(true);
        try {
            // **PENTING: Tambahkan include_adult: false di sini untuk keamanan konten 18+**
            const res = await api.get("/discover/tv", {
                params: { 
                    page, 
                    sort_by: sortBy,
                    include_adult: false, // Tambahkan filter konten dewasa
                },
            });

            // Filter hasil secara lokal sebagai lapisan keamanan tambahan
            const filteredSeries = res.data.results.filter(item => item.adult !== true);

            setSeries(filteredSeries);
            // Batasi totalPages agar tidak terlalu besar di UI
            setTotalPages(Math.min(res.data.total_pages, 500)); 
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSeries();
    }, [page, sortBy]);

    // Fungsi pembantu untuk mendapatkan label dari nilai sortBy
    const getSortLabel = (key) => {
        switch (key) {
            case "first_air_date.desc": return "Terbaru → Terlama";
            case "first_air_date.asc": return "Terlama → Terbaru";
            case "vote_average.desc": return "Rating Tertinggi";
            case "popularity.desc": return "Paling Populer";
            default: return "Sort By";
        }
    }

    // Fungsi untuk mengubah sortBy dan mereset page ke 1
    const handleSortChange = (newSortBy) => {
        setPage(1);
        setSortBy(newSortBy);
    };

    // Daftar opsi sorting
    const sortOptions = [
        { value: "first_air_date.desc", label: "Terbaru → Terlama" },
        { value: "first_air_date.asc", label: "Terlama → Terbaru" },
        { value: "vote_average.desc", label: "Rating Tertinggi" },
        { value: "popularity.desc", label: "Paling Populer" },
    ];

    const renderCard = (serie) => {
        const imageUrl = serie.poster_path
            ? `${IMG_BASE_URL}${serie.poster_path}`
            : `https://via.placeholder.com/256x384?text=No+Image`;
        
        const rating = serie.vote_average?.toFixed(1) || 'N/A';
        const title = serie.original_name;
        const overview = serie.overview;

        // PENTING: Periksa lagi filter 18+ di sini (walaupun sudah difilter di fetchSeries)
        if (serie.adult) return null; 

        return (
            <div
                key={serie.id}
                // Class disamakan: w-64, dan menggunakan 'carousel-item'
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
                    
                    {/* Tag Header disamakan warnanya (red-900) */}
                    <span className="absolute top-0 left-0 bg-red-900 text-xs px-2 py-1 rounded-br-lg z-10 text-white font-semibold">
                        Series
                    </span>
                    
                    {/* Overlay Interaktif Saat Hover */}
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
                {/* 👇 PERUBAHAN DI SINI: Text size 3xl dan menggunakan textPrimary */}
                <h2 className={`text-3xl font-bold flex items-center gap-2 ${textPrimary}`}>
                    📺 List Series
                </h2>
                
                {/* DROPDOWN AESTHETIC BARU */}
                <div className="dropdown dropdown-end">
                    
                    {/* Tombol Dropdown */}
                    <div tabIndex={0} role="button" className="
                        btn btn-sm text-sm border-2 border-red-700 
                        bg-transparent text-base-content 
                        hover:bg-red-700 hover:text-white transition duration-300
                    ">
                        {getSortLabel(sortBy)}
                        
                        {/* Ikon panah ke bawah */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </div>

                    {/* Isi Dropdown (Menu) */}
                    <ul tabIndex={0} className="
                        dropdown-content z-[1] menu p-2 shadow-xl rounded-box w-52 
                        bg-base-300 text-base-content /* Latar belakang dan teks adaptif tema */
                    ">
                        {sortOptions.map(option => (
                            <li key={option.value}>
                                <a 
                                    onClick={() => handleSortChange(option.value)}
                                    className={
                                        sortBy === option.value 
                                            ? "active bg-red-700 text-white" 
                                            : "hover:bg-red-700 hover:text-white"
                                    }
                                >
                                    {option.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-80">
                    {/* Menggunakan text-red-600 untuk spinner (seperti di ListTrending) */}
                    <span className={`loading loading-spinner loading-lg text-red-600`}></span>
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
                            {/* Menggunakan class 'carousel w-full space-x-4' disamakan dengan ListMovie */}
                            <div className="carousel w-full space-x-4 pb-2">
                                {series.map(renderCard)}
                            </div>
                        </div>
                    </div>
                    
                    {/* PAGINATION */}
                    <div className="flex justify-center mt-6 gap-2">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage((p) => p - 1)}
                            className={`px-3 py-1 ${btnClass} rounded disabled:opacity-50 hover:bg-red-800 transition`}
                        >
                            Prev
                        </button>
                        <span className={`font-bold flex items-center ${textPrimary}`}>
                            {page} / {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages || loading}
                            onClick={() => setPage((p) => p + 1)}
                            className={`px-3 py-1 ${btnClass} rounded disabled:opacity-50 hover:bg-red-800 transition`}
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