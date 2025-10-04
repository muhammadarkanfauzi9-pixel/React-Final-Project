import axios from "axios";

// Base API untuk TMDB
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_KEY_TMDB}`,
  },
});

export default api;
