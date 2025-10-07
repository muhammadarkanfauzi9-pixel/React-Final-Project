// Import React untuk membuat komponen
// Import React untuk membuat komponen
import React from "react";

// Import useSelector dari react-redux untuk mengambil data dari Redux store

// Import useSelector dari react-redux untuk mengambil data dari Redux store
import { useSelector } from "react-redux";

// Import useTheme dari context ThemeContext untuk ambil tema (dark / light)

// Import useTheme dari context ThemeContext untuk ambil tema (dark / light)
import { useTheme } from "../../context/ThemeContext";

// Import komponen FavoriteView (bagian UI) dari folder pages

// Import komponen FavoriteView (bagian UI) dari folder pages
import FavoriteView from "../../pages/favorite/FavoriteView";

// Membuat komponen utama FavoriteComponent
// Membuat komponen utama FavoriteComponent
const FavoriteComponent = () => {
  // Ambil data "favorites" dari Redux store.
  // Jika state.favorite.favorites belum ada, maka gunakan array kosong sebagai default.
  // Ambil data "favorites" dari Redux store.
  // Jika state.favorite.favorites belum ada, maka gunakan array kosong sebagai default.
  const favorites = useSelector((state) => state.favorite.favorites || []);

  // Ambil data "theme" dari context untuk tahu tema saat ini (dark atau light).

  // Ambil data "theme" dari context untuk tahu tema saat ini (dark atau light).
  const { theme } = useTheme();

  // Render komponen FavoriteView dengan mengirimkan props: favorites dan theme
  // Render komponen FavoriteView dengan mengirimkan props: favorites dan theme
  return <FavoriteView favorites={favorites} theme={theme} />;
};

// Export komponen supaya bisa digunakan di file lain
// Export komponen supaya bisa digunakan di file lain
export default FavoriteComponent;