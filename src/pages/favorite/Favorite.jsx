// src/components/Favorite/FavoriteContainer.jsx

import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFavorite } from "../../reducer/favoriteReducer";
import FavoriteView from "./FavoriteView";

const Favorite = () => {
  // 1. Perbaikan di sini: Ambil state.favorite, berikan default objek kosong ({}) 
  //    jika 'state.favorite' belum terinisialisasi.
  const favoriteState = useSelector((state) => state.favorite || {});
  
  // 2. Perbaikan di sini: Destrukturisasi 'films', 'tvs', dan 'people'
  //    dari 'favoriteState', berikan default array kosong ([]) jika properti tersebut undefined.
  const { 
    films = [], 
    tvs = [], 
    people = [] 
  } = favoriteState;
  
  const dispatch = useDispatch();
  
  // Re-membuat objek favorites yang sudah dijamin aman untuk dilewatkan ke View
  const favorites = { films, tvs, people };

  // Handler untuk menghapus item favorit
  const handleRemoveFavorite = useCallback((item, type) => {
    dispatch(removeFavorite(item.id, type));
    alert(`🗑️ ${item.title || item.name} telah dihapus dari Favorite!`);
  }, [dispatch]);

  // Tentukan apakah ada item favorit sama sekali
  // BARIS INI SEKARANG AMAN karena films, tvs, dan people dijamin berupa array ([]).
  const hasFavorites = 
    films.length > 0 || 
    tvs.length > 0 || 
    people.length > 0;

  // Melewatkan data dan handler ke komponen View
  return (
    <div className="container mx-auto p-4">
      <FavoriteView
        favorites={favorites} // Meneruskan objek favorit yang aman
        onRemove={handleRemoveFavorite} // Meneruskan handler penghapusan
        hasFavorites={hasFavorites} // Meneruskan status keberadaan favorit
      />
    </div>
  );
};

export default Favorite;