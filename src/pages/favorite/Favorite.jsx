import React, { useCallback } from "react"; // Import React & useCallback untuk membuat handler efisien
import { useSelector, useDispatch } from "react-redux"; // Hook redux untuk ambil state & dispatch action
import { removeFavorite } from "../../reducer/favoriteReducer"; // Import action removeFavorite
import FavoriteView from "./FavoriteView"; // Import komponen tampilan

const Favorite = () => {
  // Ambil state favorite dari Redux store, kalau belum ada kasih default {}
  const favoriteState = useSelector((state) => state.favorite || {});
  
  // Destrukturisasi films, tvs, people dari favoriteState, default array kosong
  const { 
    films = [], 
    tvs = [], 
    people = [] 
  } = favoriteState;
  
  const dispatch = useDispatch(); // Hook untuk dispatch action
  
  // Satukan state ke dalam satu objek agar aman diteruskan ke View
  const favorites = { films, tvs, people };

  // Handler untuk hapus favorite (dibungkus useCallback supaya referensi tetap)
  const handleRemoveFavorite = useCallback((item, type) => {
    dispatch(removeFavorite(item.id, type)); // Dispatch hapus berdasarkan id & tipe
    alert(`🗑️ ${item.title || item.name} telah dihapus dari Favorite!`); // Notifikasi popup
  }, [dispatch]);

  // Cek apakah ada favorit (kalau semua kosong → false)
  const hasFavorites = 
    films.length > 0 || 
    tvs.length > 0 || 
    people.length > 0;

  // Render tampilan
  return (
    <div className="container mx-auto p-4">
      <FavoriteView
        favorites={favorites}       // Data favorit aman
        onRemove={handleRemoveFavorite} // Handler hapus favorit
        hasFavorites={hasFavorites} // Status ada/tidaknya favorit
      />
    </div>
  );
};

export default Favorite; // Export komponen
