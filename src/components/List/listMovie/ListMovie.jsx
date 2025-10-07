import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../service/api";
import { useTheme } from "../../../context/ThemeContext";

const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500"; 

const ListMovie = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("release_date.desc");
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const {theme} = useTheme;

    // Catatan: bgColor tidak digunakan, tapi jika digunakan, pastikan adaptif.
    // const bgColor = theme === 'dark' ? 'from-base-100' : 'from-base-100'; 

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const res = await api.get("/discover/movie", {
                params: { page, sort_by: sortBy },
            });
            setMovies(res.data.results);
            // Batasi totalPages agar tidak terlalu besar di UI
            setTotalPages(Math.min(res.data.total_pages, 500)); 
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMovies();
    }, [page, sortBy]);
    
    // Fungsi pembantu untuk mendapatkan label dari nilai sortBy
    const getSortLabel = (key) => {
        switch (key) {
            case "release_date.desc": return "Terbaru → Terlama";
            case "release_date.asc": return "Terlama → Terbaru";
            case "vote_average.desc": return "Rating Tertinggi";
            case "popularity.desc": return "Paling Populer";
            default: return "Sort By";
        }
    }

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
                className="w-40 md:w-48 lg:w-56 flex-shrink-0 relative rounded-lg overflow-hidden shadow-md transform transition duration-300
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
                    <span className="absolute top-0 left-0 bg-red-700 text-xs px-2 py-1 rounded-br-lg z-10 text-white font-semibold">
                        Movie
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

    // Fungsi untuk mengubah sortBy dan mereset page ke 1
    const handleSortChange = (newSortBy) => {
        setPage(1);
        setSortBy(newSortBy);
    };

    // Daftar opsi sorting
    const sortOptions = [
        { value: "release_date.desc", label: "Terbaru → Terlama" },
        { value: "release_date.asc", label: "Terlama → Terbaru" },
        { value: "vote_average.desc", label: "Rating Tertinggi" },
        { value: "popularity.desc", label: "Paling Populer" },
    ];

    return (
        <div className="p-4 container mx-auto">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-red-700">
                    🎬 List Movies
                </h2>
                
                {/* 👇 DROPDOWN AESTHETIC BARU */}
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
                {/* 👆 AKHIR DROPDOWN */}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-80">
                    <span className="loading loading-spinner loading-lg text-red-700"></span>
                </div>
            ) : (
                <>
                    <div className="relative">
                        {/* GRADIENT KIRI - Disesuaikan agar adaptif */}
                        <div
                            className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-base-100 to-transparent pointer-events-none z-10`}
                        />
                        
                        {/* GRADIENT KANAN - Disesuaikan agar adaptif */}
                        <div
                            className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-base-100 to-transparent pointer-events-none z-10`}
                        />

                        {/* Mengganti 'carousel' dengan grid/flex agar sesuai dengan tampilan umum list */}
                        <div className="overflow-x-auto scroll-smooth pb-2 px-4">
                            <div className="flex space-x-4 pb-2">
                                {movies.map(renderCard)}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-6 gap-2">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-3 py-1 bg-red-700 text-white rounded disabled:opacity-50 hover:bg-red-600 transition"
                        >
                            Prev
                        </button>
                        <span className="text-base-content font-bold flex items-center">
                            {page} / {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages || loading}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-3 py-1 bg-red-700 text-white rounded disabled:opacity-50 hover:bg-red-600 transition"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ListMovie;