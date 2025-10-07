import { configureStore } from "@reduxjs/toolkit"; // Import configureStore dari redux toolkit // Mengimpor configureStore dari Redux Toolkit
import { favoriteReducer } from "../reducer/favoriteReducer"; // Import reducer favorite // Mengimpor reducer favorit

// Konfigurasi store utama Redux // Komentar: Mengkonfigurasi store Redux utama
const Store = configureStore({ // Membuat store dengan configureStore
  reducer: { // Menentukan reducer
    favorite: favoriteReducer, // Menambahkan reducer favorit
  },
});

export default Store; // Export store // Mengekspor store sebagai default
