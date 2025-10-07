// Import React untuk membuat komponen // Komentar: Import React
// Import React untuk membuat komponen // Komentar: Import React
import React from "react"; // Mengimpor React

// Import useSelector dari react-redux untuk mengambil data dari Redux store // Komentar: Import useSelector

// Import useSelector dari react-redux untuk mengambil data dari Redux store // Komentar: Import useSelector
import { useSelector } from "react-redux"; // Mengimpor useSelector dari react-redux

// Import useTheme dari context ThemeContext untuk ambil tema (dark / light) // Komentar: Import useTheme

// Import useTheme dari context ThemeContext untuk ambil tema (dark / light) // Komentar: Import useTheme
import { useTheme } from "../../context/ThemeContext"; // Mengimpor useTheme dari ThemeContext

// Import komponen FavoriteView (bagian UI) dari folder pages // Komentar: Import FavoriteView

// Import komponen FavoriteView (bagian UI) dari folder pages // Komentar: Import FavoriteView
import FavoriteView from "../../pages/favorite/FavoriteView"; // Mengimpor FavoriteView

// Membuat komponen utama FavoriteComponent // Komentar: Komponen FavoriteComponent
// Membuat komponen utama FavoriteComponent // Komentar: Komponen FavoriteComponent
const FavoriteComponent = () => { // Mendefinisikan komponen FavoriteComponent
  // Ambil data "favorites" dari Redux store. // Komentar: Ambil favorites
  // Jika state.favorite.favorites belum ada, maka gunakan array kosong sebagai default. // Komentar: Default array kosong
  // Ambil data "favorites" dari Redux store. // Komentar: Ambil favorites
  // Jika state.favorite.favorites belum ada, maka gunakan array kosong sebagai default. // Komentar: Default array kosong
  const favorites = useSelector((state) => state.favorite.favorites || []); // Menggunakan useSelector untuk favorites

  // Ambil data "theme" dari context untuk tahu tema saat ini (dark atau light). // Komentar: Ambil theme

  // Ambil data "theme" dari context untuk tahu tema saat ini (dark atau light). // Komentar: Ambil theme
  const { theme } = useTheme(); // Menggunakan useTheme untuk theme

  // Render komponen FavoriteView dengan mengirimkan props: favorites dan theme // Komentar: Render FavoriteView
  // Render komponen FavoriteView dengan mengirimkan props: favorites dan theme // Komentar: Render FavoriteView
  return <FavoriteView favorites={favorites} theme={theme} />; // Mengembalikan FavoriteView dengan props
};

// Export komponen supaya bisa digunakan di file lain // Komentar: Export komponen
// Export komponen supaya bisa digunakan di file lain // Komentar: Export komponen
export default FavoriteComponent; // Mengekspor FavoriteComponent
