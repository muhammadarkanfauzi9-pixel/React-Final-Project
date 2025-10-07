import axios from "axios"; // Mengimpor axios untuk HTTP requests

  // Base API untuk TMDB // Komentar: Konfigurasi base API untuk The Movie Database
  const api = axios.create({ // Membuat instance axios
    baseURL: "https://api.themoviedb.org/3", // URL base API TMDB
    headers: { // Header untuk autentikasi
      Authorization: `Bearer ${import.meta.env.VITE_KEY_TMDB}`, // Token bearer dari environment variable
    },
  });

  export default api; // Mengekspor instance api
