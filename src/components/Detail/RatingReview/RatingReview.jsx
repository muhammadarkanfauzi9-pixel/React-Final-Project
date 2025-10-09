import React, { useState, useEffect } from "react";
// Mengimpor icon
import { FaStar, FaRegStar, FaUserCircle } from "react-icons/fa";

// Komponen utama menerima props filmId (id film) dan theme (tema gelap/terang)
const RatingReview = ({ filmId, theme }) => {

    // State untuk menyimpan rating, teks review, nama pengguna, dan daftar review
    const [userRating, setUserRating] = useState(0); 
    const [hoverRating, setHoverRating] = useState(0); 
    const [reviewText, setReviewText] = useState(""); 
    const [reviews, setReviews] = useState([]); 
    const [userName, setUserName] = useState(""); 
    const [showForm, setShowForm] = useState(false); 
    const [editingId, setEditingId] = useState(null); 

    // Kelas CSS berdasarkan tema
    const themeClass = theme === "dark" 
        ? "bg-gray-800 text-white" 
        : "bg-white text-gray-900";

    const borderClass = theme === "dark" 
        ? "border-gray-700" 
        : "border-gray-200";

    // Kunci localStorage yang dinamis
    const localStorageKey = `reviews_${filmId}`;

    // 🔹 useEffect pertama: mengambil data review dari localStorage
    useEffect(() => {
        const savedReviews = localStorage.getItem(localStorageKey);
        if (savedReviews) {
            setReviews(JSON.parse(savedReviews));
        }
    }, [filmId, localStorageKey]); // Tambahkan localStorageKey ke dependency array

    // 🔹 Fungsi untuk menyimpan data review ke localStorage setiap kali berubah
    const saveReviews = (newReviews) => {
        localStorage.setItem(localStorageKey, JSON.stringify(newReviews));
        setReviews(newReviews);
    };

    // 🔹 Hitung rata-rata rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    // 🔹 Fungsi ketika user men-submit review
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi input
        if (!userName.trim()) return alert("Masukkan nama Anda!");
        if (userRating === 0) return alert("Berikan rating terlebih dahulu!");
        if (!reviewText.trim()) return alert("Tulis review Anda!");

        // Objek review baru
        const newReview = {
            id: editingId || Date.now(), 
            userName: userName.trim(),
            rating: userRating,
            text: reviewText.trim(),
            date: new Date().toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            })
        };

        if (editingId) {
            // Edit review
            const updatedReviews = reviews.map(r => 
                r.id === editingId ? newReview : r
            );
            saveReviews(updatedReviews);
            setEditingId(null);
        } else {
            // Tambah review baru
            saveReviews([newReview, ...reviews]);
        }

        // Reset form setelah submit
        setUserRating(0);
        setReviewText("");
        setUserName("");
        setShowForm(false);
    };

    // 🔹 Fungsi edit review
    const handleEdit = (review) => {
        setEditingId(review.id);
        setUserName(review.userName);
        setUserRating(review.rating);
        setReviewText(review.text);
        setShowForm(true); 
    };

    // 🔹 Fungsi hapus review
    const handleDelete = (id) => {
        if (window.confirm("Hapus review ini?")) {
            const updatedReviews = reviews.filter(r => r.id !== id);
            saveReviews(updatedReviews);
        }
    };

    // 🔹 Fungsi render bintang rating (bisa interaktif atau hanya tampilan)
    const renderStars = (rating, isInteractive = false) => {
        // Tentukan rating yang akan ditampilkan (hover > userRating > rating statis)
        const displayRating = isInteractive ? (hoverRating || userRating) : rating;

        return [...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
                <button
                    key={index}
                    type="button"
                    disabled={!isInteractive}
                    onClick={() => isInteractive && setUserRating(starValue)}
                    onMouseEnter={() => isInteractive && setHoverRating(starValue)}
                    onMouseLeave={() => isInteractive && setHoverRating(0)}
                    // Styling dirapikan
                    className={`text-2xl transition-all ${isInteractive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                >
                    {starValue <= displayRating
                        ? <FaStar className="text-yellow-400" /> 
                        : <FaRegStar className="text-gray-400" />
                    }
                </button>
            );
        });
    };

    // 🔹 Bagian tampilan utama
    return (
        // Menggunakan template literal yang benar
        <div className={`${themeClass} rounded-xl p-6 shadow-lg border ${borderClass} mt-8`}>

            {/* Header & rata-rata rating */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Rating & Review</h2>
                    {reviews.length > 0 && (
                        <div className="flex items-center gap-2">
                            <div className="flex">{renderStars(Math.round(averageRating))}</div>
                            <span className="text-xl font-semibold">{averageRating}</span>
                            <span className="text-gray-500">({reviews.length} review)</span>
                        </div>
                    )}
                </div>

                {/* Tombol untuk membuka form review */}
                {!showForm && (
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setEditingId(null); // Pastikan mode edit mati saat tombol "Tulis Review" diklik
                            setUserRating(0);
                            setReviewText("");
                        }}
                        className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-2 rounded-lg transition"
                    >
                        + Tulis Review
                    </button>
                )}
            </div>

            {/* Form input review */}
            {showForm && (
                <form 
                    onSubmit={handleSubmit} 
                    className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} p-6 rounded-lg mb-6 border ${borderClass}`}
                >
                    <h3 className="text-lg font-semibold mb-4">
                        {editingId ? "Edit Review Anda" : "Tulis Review Anda"}
                    </h3>

                    {/* Input Nama */}
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Nama Anda</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Masukkan nama Anda"
                            // Styling dirapikan
                            className={`w-full px-4 py-2 rounded-lg border ${borderClass} ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"} focus:ring-2 focus:ring-red-500 focus:outline-none`}
                        />
                    </div>

                    {/* Rating Bintang */}
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Rating Anda</label>
                        <div className="flex gap-1">{renderStars(userRating, true)}</div>
                        {userRating > 0 && (
                            <p className="text-sm text-gray-500 mt-1">{userRating} dari 5 bintang</p>
                        )}
                    </div>

                    {/* Textarea Review */}
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Review Anda</label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Bagikan pendapat Anda tentang film ini..."
                            rows="4"
                            // Styling dirapikan
                            className={`w-full px-4 py-2 rounded-lg border ${borderClass} ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"} focus:ring-2 focus:ring-red-500 focus:outline-none resize-none`}
                        />
                    </div>

                    {/* Tombol Submit dan Batal */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-2 rounded-lg transition"
                        >
                            {editingId ? "Update Review" : "Submit Review"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setUserRating(0);
                                setReviewText("");
                                setUserName("");
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            )}

            {/* Daftar review yang sudah dibuat */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                        Belum ada review. Jadilah yang pertama!
                    </p>
                ) : (
                    reviews.map((review) => (
                        <div 
                            key={review.id} 
                            // Menggunakan template literal yang benar
                            className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg border ${borderClass}`}
                        >
                            {/* Header review: nama dan rating */}
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <FaUserCircle className="text-3xl text-red-700" />
                                    <div>
                                        <h4 className="font-semibold">{review.userName}</h4>
                                        <p className="text-xs text-gray-500">{review.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex">{renderStars(review.rating)}</div>
                                    <span className="font-semibold">{review.rating}</span>
                                </div>
                            </div>

                            {/* Isi review */}
                            <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} mt-3 leading-relaxed`}>
                                {review.text}
                            </p>

                            {/* Tombol Edit & Hapus */}
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => handleEdit(review)}
                                    className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RatingReview;