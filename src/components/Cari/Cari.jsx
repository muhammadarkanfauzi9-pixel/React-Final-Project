// src/components/Cari/Cari.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

// Import instance Axios yang sudah dikonfigurasi
import api from "../../service/api"; 

// Key untuk menyimpan kategori pencarian terakhir di LocalStorage
const CATEGORY_STORAGE_KEY = "lastSearchCategory";

const Cari = () => {
    const { theme } = useTheme();

    // State untuk kontrol input dan hasil
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notif, setNotif] = useState("");
    const [zoomImage, setZoomImage] = useState(null); // State untuk modal zoom gambar (belum digunakan)

    // Mengambil kategori tersimpan dari LocalStorage atau default ke 'movie'
    const savedCategory = localStorage.getItem(CATEGORY_STORAGE_KEY) || "movie";

    // State untuk kategori pencarian ('movie', 'tv', 'multi')
    const [searchType, setSearchType] = useState(savedCategory);
    
    // State untuk pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // State untuk membedakan antara mode "Populer" dan "Cari"
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const IMG_URL = "https://image.tmdb.org/t/p/w500";

    const isDark = theme === "dark";

    // Objek untuk mengelola kelas Tailwind berdasarkan tema
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
    
    // --- FUNGSI UTAMA: Mengambil data Populer (Jika query kosong) ---
    const fetchInitialData = async (typeToFetch, pageToFetch = 1) => {
        // Jika 'multi' dipilih, gunakan 'movie' populer untuk tampilan awal
        if (typeToFetch === 'multi') typeToFetch = 'movie'; 
        
        setIsInitialLoad(true);
        setLoading(true);
        try {
            const res = await api.get(`/${typeToFetch}/popular`, {
                params: {
                    language: "en-US",
                    page: pageToFetch,
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
            window.scrollTo(0, 0); // Gulir ke atas halaman
        }
    };
    
    // --- FUNGSI UTAMA: Melakukan Pencarian (Jika ada input query) ---
    const executeSearch = async (pageToFetch = 1, currentSearchType = searchType) => {
        // Jika query kosong, muat data populer
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
                    include_adult: false 
                },
            });

            // Filter tipe 'person' (aktor/kru) jika menggunakan mode 'multi'
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
            window.scrollTo(0, 0); // Gulir ke atas halaman
        }
    };

    // Handler saat form pencarian disubmit
    const handleSearch = (e) => {
        if (e) e.preventDefault();
        setCurrentPage(1); // Reset ke halaman 1
        executeSearch(1);
    };
    
    // Handler untuk mengubah kategori dari sidebar
    const handleCategoryChange = (newType) => {
        setSearchType(newType);
        localStorage.setItem(CATEGORY_STORAGE_KEY, newType); // Simpan kategori
        setCurrentPage(1);

        if (!query.trim()) {
            // Jika kolom pencarian kosong, muat data populer
            setIsInitialLoad(true);
            fetchInitialData(newType, 1);
        } else {
            // Jika ada query, jalankan ulang pencarian dengan tipe baru
            setIsInitialLoad(false);
            executeSearch(1, newType);
        }
    }
    
    // --- useEffect: Memuat data awal saat komponen pertama kali di-mount ---
    useEffect(() => {
        fetchInitialData(searchType, 1);
    }, []); 

    // --- useEffect: Mengulang pencarian/pengambilan data saat halaman (currentPage) berubah ---
    useEffect(() => {
        if (currentPage !== 1) { // Mencegah double fetch pada inisialisasi awal
            if (query.trim()) {
                executeSearch(currentPage);
            } else {
                fetchInitialData(searchType, currentPage);
            }
        }
    }, [currentPage]);


    // Komponen Pesan Hasil Kosong
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
    
    // Komponen Sidebar untuk Filter Kategori
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
            
            {/* Notifikasi Pop-up (di tengah layar) */}
            {notif && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg shadow-lg z-50">
                    {notif}
                </div>
            )}

            {/* Form Pencarian */}
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
                
                {/* Kolom 1: Sidebar Kategori */}
                <div className="lg:col-span-1">
                    <SidebarCategory />
                </div>

                {/* Kolom 2: Hasil Pencarian/Populer */}
                <div className="lg:col-span-3">
                    {/* Indikator Loading */}
                    {loading && <p className="text-center p-10">⏳ Sedang memuat data...</p>}

                    {/* Tampilkan Hasil (Grid) atau Pesan Kosong */}
                    {!loading && (
                        results.length > 0 ? (
                            <>
                                {/* Info Judul dan Halaman */}
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
                                
                                {/* Grid Hasil */}
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {results.map((item) => {
                                        // Tentukan tipe media (movie/tv), utamakan media_type dari 'multi'
                                        const mediaType = item.media_type || (searchType === 'tv' ? 'tv' : 'movie');
                                        const isMovie = mediaType === 'movie';
                                        
                                        // Ambil Judul yang sesuai
                                        const titleText = isMovie ? item.original_title || item.title : item.name;
                                        
                                        // Tentukan path Link
                                        const linkPath = isMovie ? `/film/${item.id}` : `/series/${item.id}`;
                                        const rating = item.vote_average?.toFixed(1) || 'N/A';
                                        
                                        // Tentukan URL Poster
                                        const imageUrl = item.poster_path
                                            ? `${IMG_URL}${item.poster_path}`
                                            : `https://via.placeholder.com/500x750?text=No+Image`;
                                        
                                        const mediaLabel = isMovie ? 'FILM' : 'SERIES';

                                        return (
                                            <div
                                                key={item.id}
                                                className="relative rounded-lg overflow-hidden shadow-md transform transition duration-300 group hover:scale-[1.03] hover:shadow-2xl hover:shadow-red-600/50"
                                            >
                                                <Link
                                                    to={linkPath}
                                                    className="block group relative w-full h-full"
                                                >
                                                    {/* Image Poster */}
                                                    <img
                                                        src={imageUrl}
                                                        alt={titleText}
                                                        // Gunakan rasio aspek 2/3 untuk konsistensi poster
                                                        className="w-full h-full object-cover rounded-lg aspect-[2/3]"
                                                        onError={(e) => { e.target.src = `https://via.placeholder.com/500x750?text=Error+Loading`; }}
                                                    />
                                                    
                                                    {/* Tag Tipe Media */}
                                                    <span className="absolute top-0 left-0 bg-red-900 text-xs px-2 py-1 rounded-br-lg z-10 text-white font-semibold">
                                                        {mediaLabel}
                                                    </span>
                                                    
                                                    {/* Overlay Interaktif Saat Hover */}
                                                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                                                        <h3 className="text-xl font-extrabold mb-1 line-clamp-2">{titleText}</h3>
                                                        <p className="text-yellow-400 text-lg flex items-center mb-2">
                                                            <span className="mr-1">⭐</span> {rating}
                                                        </p>
                                                        <p className="text-sm text-gray-300 line-clamp-3">
                                                            {item.overview || "No overview available."}
                                                        </p>
                                                    </div>
                                                </Link>
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
                                        <span className={`px-4 py-2 font-bold border rounded-lg ${themeClasses.textPrimary} ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
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
                            // Tampilkan pesan kosong hanya setelah pencarian yang menghasilkan 0
                            !isInitialLoad && query.trim() ? emptyResultMessage : null 
                        )
                    )}
                </div>
            </div>

            {/* Modal Zoom Gambar (Struktur modal, meskipun fungsionalitasnya belum dipicu di grid) */}
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