// src/components/Detail/RatingReview/RatingReview.jsx

import React, { useState, useEffect } from "react"; 
import { FaStar, FaRegStar, FaUserCircle } from "react-icons/fa"; 

/**
 * Komponen interaktif untuk menampilkan, menambah, mengedit, dan menghapus rating/review lokal.
 * Data disimpan di localStorage.
 */
const RatingReview = ({ filmId, theme }) => { 
    // === STATE MANAGEMENT ===
    const [userRating, setUserRating] = useState(0); 
    const [hoverRating, setHoverRating] = useState(0); 
    const [reviewText, setReviewText] = useState(""); 
    const [reviews, setReviews] = useState([]); // Daftar review yang dimuat
    const [userName, setUserName] = useState(""); 
    const [showForm, setShowForm] = useState(false); // Kontrol tampilan form
    const [editingId, setEditingId] = useState(null); // ID review yang sedang di-edit

    // === TEMA & STYLING ===
    const themeClass = theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900";
    const borderClass = theme === "dark" ? "border-gray-700" : "border-gray-200";

    // === SIDE EFFECTS: LOAD & SAVE DATA ===

    // Efek: Muat reviews dari localStorage saat komponen dimuat atau filmId berubah
    useEffect(() => { 
        const savedReviews = localStorage.getItem(`reviews_${filmId}`); 
        if (savedReviews) { 
            setReviews(JSON.parse(savedReviews)); 
        }
    }, [filmId]); 

    // Fungsi utilitas: Simpan reviews ke localStorage dan update state
    const saveReviews = (newReviews) => { 
        localStorage.setItem(`reviews_${filmId}`, JSON.stringify(newReviews)); 
        setReviews(newReviews); 
    };

    // Hitung rata-rata rating dari semua review yang ada
    const averageRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
        : 0; 

    // === HANDLERS CRUD ===

    // Handler: Submit review (Tambah baru atau Update)
    const handleSubmit = (e) => { 
        e.preventDefault(); 
        
        if (!userName.trim() || userRating === 0 || !reviewText.trim()) { 
            alert("Harap lengkapi Nama, Rating, dan Review Anda."); 
            return; 
        }

        const newReview = { 
            id: editingId || Date.now(), // Gunakan ID yang ada jika mengedit
            userName: userName.trim(), 
            rating: userRating, 
            text: reviewText.trim(), 
            date: new Date().toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            })
        };

        if (editingId) { 
            // Logika Update
            const updatedReviews = reviews.map(r => 
                r.id === editingId ? newReview : r 
            );
            saveReviews(updatedReviews); 
            setEditingId(null); 
        } else { 
            // Logika Tambah Baru
            saveReviews([newReview, ...reviews]); 
        }

        // Reset dan sembunyikan form
        setUserRating(0); 
        setReviewText(""); 
        setUserName(""); 
        setShowForm(false); 
    };

    // Handler: Mempersiapkan form untuk Edit
    const handleEdit = (review) => { 
        setEditingId(review.id); 
        setUserName(review.userName); 
        setUserRating(review.rating); 
        setReviewText(review.text); 
        setShowForm(true); 
    };

    // Handler: Menghapus review
    const handleDelete = (id) => { 
        if (window.confirm("Apakah Anda yakin ingin menghapus review ini secara permanen?")) { 
            const updatedReviews = reviews.filter(r => r.id !== id); 
            saveReviews(updatedReviews); 
        }
    };

    // Fungsi utilitas: Merender bintang rating
    const renderStars = (rating, isInteractive = false) => { 
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
                    className={`text-2xl transition-all ${isInteractive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`} 
                >
                    {starValue <= displayRating ? ( 
                        <FaStar className="text-yellow-400" /> 
                    ) : ( 
                        <FaRegStar className="text-gray-400" /> 
                    )}
                </button>
            );
        });
    };

    // === RENDER JSX ===
    return ( 
        <div className={`${themeClass} rounded-xl p-6 shadow-lg border ${borderClass} mt-8`}> 
            
            {/* Header & Informasi Rata-rata Rating */}
            <div className="flex items-center justify-between mb-6"> 
                <div> 
                    <h2 className="text-2xl font-bold mb-2">Rating & Review</h2> 
                    {reviews.length > 0 && ( 
                        <div className="flex items-center gap-2"> 
                            {/* Menampilkan bintang rata-rata (dibulatkan) */}
                            <div className="flex">{renderStars(Math.round(averageRating))}</div> 
                            <span className="text-xl font-semibold">{averageRating}</span> 
                            <span className="text-gray-500">({reviews.length} review{reviews.length > 1 ? 's' : ''})</span> 
                        </div>
                    )}
                </div>
                
                {/* Tombol Tulis Review */}
                {!showForm && ( 
                    <button 
                        onClick={() => setShowForm(true)} 
                        className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-2 rounded-lg transition" 
                    >
                        + Tulis Review
                    </button>
                )}
            </div>

            {/* Form Input/Edit Review */}
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
                            className={`w-full px-4 py-2 rounded-lg border ${borderClass} ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"} focus:ring-2 focus:ring-red-500 focus:outline-none`} 
                        />
                    </div>

                    {/* Rating Stars Interaktif */}
                    <div className="mb-4"> 
                        <label className="block mb-2 font-medium">Rating Anda</label> 
                        <div className="flex gap-1"> 
                            {renderStars(userRating, true)} 
                        </div>
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
                            className={`w-full px-4 py-2 rounded-lg border ${borderClass} ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"} focus:ring-2 focus:ring-red-500 focus:outline-none resize-none`} 
                        />
                    </div>

                    {/* Tombol Aksi Form */}
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

            {/* Daftar Review */}
            <div className="space-y-4"> 
                <h3 className="text-xl font-bold border-t pt-6 mb-4">Ulasan Pengguna</h3>
                {reviews.length === 0 ? ( 
                    <p className="text-center text-gray-500 py-8">Belum ada review. Jadilah yang pertama!</p> 
                ) : ( 
                    reviews.map((review) => ( 
                        <div 
                            key={review.id} 
                            className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg border ${borderClass}`} 
                        >
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
                            <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} mt-3 leading-relaxed`}>{review.text}</p> 
                            
                            {/* Tombol Edit/Hapus Review */}
                            <div className="flex gap-4 mt-3 pt-2 border-t border-gray-600/50"> 
                                <button 
                                    onClick={() => handleEdit(review)} 
                                    className="text-sm text-blue-500 hover:text-blue-600 font-medium" 
                                >
                                    Edit 
                                </button>
                                <button 
                                    onClick={() => handleDelete(review.id)} 
                                    className="text-sm text-red-500 hover:text-red-600 font-medium" 
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