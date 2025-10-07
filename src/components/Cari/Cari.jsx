// src/components/Cari/Cari.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

// 🌟 Import instance Axios yang sudah dikonfigurasi 🌟
import api from "../../service/api"; // Sesuaikan path import ini

// Key untuk menyimpan kategori di LocalStorage
const CATEGORY_STORAGE_KEY = "lastSearchCategory";

const Cari = () => {
    const { theme } = useTheme();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notif, setNotif] = useState("");
    const [trailerKey, setTrailerKey] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const [zoomImage, setZoomImage] = useState(null);

    // Dapatkan kategori tersimpan dari LocalStorage atau gunakan 'movie' sebagai default
    const savedCategory = localStorage.getItem(CATEGORY_STORAGE_KEY) || "movie";

    const [searchType, setSearchType] = useState(savedCategory); 
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isInitialLoad, setIsInitialLoad] = useState(true); 

    const IMG_URL = "https://image.tmdb.org/t/p/w500";

    const isDark = theme === "dark";

    const themeClasses = {
        bgPrimary: isDark ? "bg-gray-900" : "bg-gray-100",
        textPrimary: isDark ? "text-white" : "text-gray-900",
        bgSecondary: isDark ? "bg-gray-800" : "bg-white",
        textSecondary: isDark ? "text-gray-400" : "text-gray-600",
        inputClass: isDark
            ? "border border-gray-600 bg-gray-700 text-white placeholder-gray-400"
            : "border border-gray-300 bg-white text-gray-900 placeholder-gray-500",
        buttonClass: "bg-red-500 text-white hover:bg-red-600",
        sidebarBg: isDark ? "bg-gray-800" : "bg-white",
        sidebarHover: isDark ? "hover:bg-red-700 hover:text-white" : "hover:bg-red-100 hover:text-red-700",
    };
    
    // --- FUNGSI MENGAMBIL DATA AWAL (POPULER) ---
    const fetchInitialData = async (typeToFetch, pageToFetch = 1) => {
        if (typeToFetch === 'multi') typeToFetch = 'movie'; 
        
        setIsInitialLoad(true);
        setLoading(true);
        try {
            const res = await api.get(`/${typeToFetch}/popular`, {
                params: { 
                    language: "en-US",
                    page: pageToFetch,
                    // Filter Konten Dewasa
                    include_adult: false 
                },
            });

            setResults(res.data.results || []);
            setTotalPages(res.data.total_pages);
            setCurrentPage(pageToFetch);

        } catch (error) {
            console.error("Fetch Initial Data Error:", error);
            setNotif("⚠ Gagal memuat data awal. Coba lagi.");
            setTimeout(() => setNotif(""), 3000);
        } finally {
            setLoading(false);
            window.scrollTo(0, 0); 
        }
    };
    
    // --- FUNGSI PENCARIAN (HANYA JIKA ADA INPUT QUERY) ---
    const executeSearch = async (pageToFetch = 1, currentSearchType = searchType) => {
        if (!query.trim()) {
             fetchInitialData(currentSearchType, 1); 
             return;
        }

        setIsInitialLoad(false); 
        setLoading(true);
        try {
            
            const endpoint = `/search/${currentSearchType}`;
            
            const res = await api.get(endpoint, {
                params: { 
                    query, 
                    language: "en-US",
                    page: pageToFetch,
                    // Filter Konten Dewasa
                    include_adult: false 
                },
            });

            // Hanya filter 'person' jika searchType adalah 'multi' (search multi juga menyertakan filter adult)
            const searchResults = currentSearchType === 'multi'
                ? res.data.results.filter(item => item.media_type !== 'person')
                : res.data.results;
            
            setTotalPages(res.data.total_pages);
            setCurrentPage(pageToFetch);

            if (searchResults.length === 0) {
                setNotif(`❌ Tidak ada hasil untuk "${query}" pada kategori ${currentSearchType.toUpperCase()}`);
                setResults([]);
                setTotalPages(1); 
                setTimeout(() => setNotif(""), 3000);
            } else {
                setResults(searchResults || []);
            }
        } catch (error) {
            console.error("Search Error:", error);
            setNotif("⚠ Gagal mengambil data. Coba lagi.");
            setTimeout(() => setNotif(""), 3000);
        } finally {
            setLoading(false);
            window.scrollTo(0, 0); 
        }
    };

    // Dipanggil saat submit form
    const handleSearch = (e) => {
        if (e) e.preventDefault();
        setCurrentPage(1); 
        executeSearch(1); 
    };
    
    // Handler untuk mengubah kategori dari sidebar
    const handleCategoryChange = (newType) => {
        setSearchType(newType);
        localStorage.setItem(CATEGORY_STORAGE_KEY, newType); 
        setCurrentPage(1);

        if (!query.trim()) {
            setIsInitialLoad(true);
            fetchInitialData(newType, 1); 
        } else {
            setIsInitialLoad(false);
            executeSearch(1, newType); 
        }
    }
    
    // --- EFFECT: MEMUAT DATA AWAL BERDASARKAN KATEGORI TERAKHIR YANG TERSIMPAN ---
    useEffect(() => {
        fetchInitialData(searchType, 1); 
    }, []); 

    // --- EFFECT: MENGULANG PENCARIAN/PENGAMBILAN DATA KETIKA PAGE BERUBAH ---
    useEffect(() => {
        if (currentPage !== 1) {
            if (query.trim()) {
                executeSearch(currentPage);
            } else {
                fetchInitialData(searchType, currentPage); 
            }
        }
    }, [currentPage]); 

    const getTrailer = async (itemId, mediaType) => {
        const type = mediaType === 'movie' ? 'movie' : 'tv';
        
        try {
            // Gunakan api.get, hanya kirim language
            const res = await api.get(`/${type}/${itemId}/videos`, {
                params: { 
                    language: "en-US",
                    // Tidak wajib di sini, tapi konsisten lebih baik
                    include_adult: false 
                },
            });
            const trailer = res.data.results.find(
                (vid) => vid.site === "YouTube" && vid.type === "Trailer"
            );
            if (trailer) {
                setTrailerKey(trailer.key);
                setShowTrailer(true);
            } else {
                setNotif(`⚠ Trailer ${mediaType === 'movie' ? 'Film' : 'Series'} tidak tersedia.`);
                setTimeout(() => setNotif(""), 3000);
            }
        } catch {
            setNotif("⚠ Gagal memuat trailer.");
            setTimeout(() => setNotif(""), 3000);
        }
    };

    const emptyResultMessage = (
        <div className="text-center py-20">
            <h2 className={`text-2xl font-bold ${themeClasses.textPrimary}`}>
                ❌ Tidak ada hasil ditemukan untuk "{query}".
            </h2>
            <p className={`${themeClasses.textSecondary}`}>
                Coba ubah kata kunci atau ganti filter kategori.
            </p>
        </div>
    );
    
    // Komponen Sidebar Kategori
    const SidebarCategory = () => {
        const categories = [
            { type: 'movie', name: 'Film Populer/Cari' },
            { type: 'tv', name: 'Series Populer/Cari' },
            { type: 'multi', name: 'Semua Hasil Pencarian' },
        ];

        return (
            <div className={`${themeClasses.sidebarBg} rounded-lg shadow-xl p-4 sticky top-6 self-start`}>
                <h3 className={`text-lg font-bold mb-4 ${themeClasses.textPrimary}`}>
                    Filter Kategori
                </h3>
                <ul className="space-y-2">
                    {categories.map((cat) => (
                        <li key={cat.type}>
                            <button
                                onClick={() => handleCategoryChange(cat.type)}
                                className={`w-full text-left p-2 rounded-lg transition duration-200 
                                    ${cat.type === searchType 
                                        ? 'bg-red-500 text-white font-semibold' 
                                        : `${themeClasses.textPrimary} ${themeClasses.sidebarHover}`
                                    }`}
                            >
                                {cat.name}
                            </button>
                        </li>
                    ))}
                </ul>
                <p className={`text-xs mt-4 ${themeClasses.textSecondary}`}>
                    *Jika kolom pencarian kosong, data yang ditampilkan adalah data Populer.
                </p>
            </div>
        );
    };


    return (
        <div className={`px-4 ${themeClasses.bgPrimary} min-h-screen ${themeClasses.textPrimary} pb-10`}>
            {/* notif */}
            {notif && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg shadow-lg z-50">
                    {notif}
                </div>
            )}

            {/* search form */}
            <form
                onSubmit={handleSearch}
                className="flex justify-center items-center gap-2 mb-8 pt-6 pb-2"
            >
                <input
                    type="text"
                    placeholder={`Cari ${searchType === 'movie' ? 'film' : searchType === 'tv' ? 'series' : 'film/series'}...`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={`rounded-lg p-3 flex-grow max-w-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${themeClasses.inputClass}`}
                />
                <button
                    type="submit"
                    className={`font-semibold px-6 py-3 rounded-lg transition ${themeClasses.buttonClass}`}
                    disabled={loading}
                >
                    🔍 Cari
                </button>
            </form>

            {/* TATA LETAK UTAMA: SIDEBAR DAN HASIL */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Kolom 1: Sidebar Kategori (Lebar 1/4) */}
                <div className="lg:col-span-1">
                    <SidebarCategory />
                </div>

                {/* Kolom 2: Hasil Pencarian (Lebar 3/4) */}
                <div className="lg:col-span-3">
                    {/* loading */}
                    {loading && <p className="text-center">⏳ Sedang memuat data...</p>}

                    {/* HASIL PENCARIAN (GRID/PESAN) */}
                    {!loading && (
                        results.length > 0 ? (
                            <>
                                <div className="text-left mb-4">
                                     <h3 className={`text-xl font-semibold ${themeClasses.textPrimary}`}>
                                        {isInitialLoad 
                                            ? `Populer ${searchType === 'tv' ? 'Series' : 'Film'}` 
                                            : `Hasil Pencarian "${query}" (${searchType.toUpperCase()})`}
                                    </h3>
                                    <p className={themeClasses.textSecondary}>
                                        Halaman {currentPage} dari {totalPages}.
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {results.map((item) => {
                                        const mediaType = item.media_type || (searchType === 'tv' ? 'tv' : 'movie');
                                        const isMovie = mediaType === 'movie';
                                        // Menggunakan original_title/name, sama seperti di ListMovie
                                        const titleText = isMovie ? item.original_title || item.title : item.name;
                                        const releaseDate = isMovie ? item.release_date : item.first_air_date;
                                        const linkPath = isMovie ? `/film/${item.id}` : `/series/${item.id}`;
                                        const rating = item.vote_average?.toFixed(1) || 'N/A';
                                        
                                        const imageUrl = item.poster_path
                                            ? `${IMG_URL}${item.poster_path}`
                                            : `https://via.placeholder.com/500x750?text=No+Image`;
                                        
                                        const mediaLabel = isMovie ? 'FILM' : 'SERIES';


                                        return (
                                            // Menggunakan Card Style dari ListMovie
                                            <div
                                                key={item.id}
                                                className={`relative rounded-lg overflow-hidden shadow-md transform transition duration-300 ${themeClasses.bgSecondary}`}
                                            >
                                                <Link 
                                                    to={linkPath} 
                                                    className="block group relative w-full h-full transform transition duration-300 hover:scale-[1.03] hover:shadow-xl"
                                                >
                                                    {/* Image */}
                                                    <img
                                                        src={imageUrl}
                                                        alt={titleText}
                                                        // Menggunakan aspect-[2/3] agar konsisten
                                                        className="w-full h-full object-cover rounded-lg aspect-[2/3]" 
                                                        onError={(e) => { e.target.src = `https://via.placeholder.com/500x750?text=Error+Loading`; }}
                                                    />
                                                    
                                                    {/* Tag Header */}
                                                    <span className="absolute top-0 left-0 bg-red-500 text-xs px-2 py-1 rounded-br-lg z-10 text-white font-semibold">
                                                        {mediaLabel}
                                                    </span>
                                                    
                                                    {/* Overlay Interaktif Saat Hover */}
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                                                        <h3 className="text-sm md:text-xl font-extrabold mb-1 line-clamp-2">{titleText}</h3>
                                                        <p className="text-yellow-400 text-sm md:text-lg flex items-center">
                                                            <span className="mr-1">⭐</span> {rating}
                                                        </p>
                                                        <p className="text-xs md:text-sm text-gray-300 mt-1">
                                                            Rilis: {releaseDate || 'N/A'}
                                                        </p>
                                                        
                                                        {/* Ikon Play Besar */}
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <svg className="w-10 h-10 md:w-16 md:h-16 text-white bg-red-700/80 p-2 md:p-3 rounded-full opacity-90 transition duration-300" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </Link>
                                                
                                                {/* Tombol Trailer (Diletakkan di luar Link agar hover effect tidak tumpang tindih) */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Mencegah klik menyebar ke Link
                                                        getTrailer(item.id, mediaType);
                                                    }}
                                                    className={`w-full text-xs py-1 px-2 rounded-b-lg font-semibold transition ${themeClasses.buttonClass} block`}
                                                >
                                                    🎥 Lihat Trailer
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {/* Kontrol Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center mt-8 gap-3">
                                        <button
                                            onClick={() => setCurrentPage(p => p - 1)}
                                            disabled={currentPage === 1 || loading}
                                            className={`px-4 py-2 rounded-lg font-semibold transition ${themeClasses.buttonClass} disabled:opacity-50`}
                                        >
                                            ← Sebelumnya
                                        </button>
                                        <span className={`px-4 py-2 font-bold border rounded-lg ${themeClasses.textPrimary} ${themeClasses.inputClass.includes('dark') ? 'border-gray-600' : 'border-gray-300'}`}>
                                            Halaman {currentPage} / {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => p + 1)}
                                            disabled={currentPage === totalPages || loading}
                                            className={`px-4 py-2 rounded-lg font-semibold transition ${themeClasses.buttonClass} disabled:opacity-50`}
                                        >
                                            Selanjutnya →
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            !isInitialLoad && query.trim() ? emptyResultMessage : null
                        )
                    )}
                </div>
            </div>

            {/* modal trailer dan zoom gambar (tetap sama) */}
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