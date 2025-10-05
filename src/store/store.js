import { configureStore } from "@reduxjs/toolkit"; // Import configureStore dari redux toolkit
import { favoriteReducer } from "../reducer/favoriteReducer"; // Import reducer favorite

// Konfigurasi store utama Redux
const Store = configureStore({
  reducer: {
    favorite: favoriteReducer, // Tambahkan reducer favorite ke dalam store
  },
});

export default Store; // Export store
