import React, { useState, useEffect } from "react";
import axios from "axios";
import HomeView from "./HomeView";

const Home = ({ isMuted, toggleSound }) => {
  const [trendingMovie, setTrendingMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [trending, setTrending] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Konfigurasi dasar API TMDB ---
  const apiHeaders = {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_KEY_TMDB}`,
    },
  };

  const defaultParams = {
    params: {
      include_adult: false,
      language: "en-US",
    },
  };

  // Gabungkan konfigurasi axios (header + params)
  const apiConfig = {
    ...apiHeaders,
    ...defaultParams,
  };

  useEffect(() => {
    const controller = new AbortController(); // untuk pembatalan request

    const fetchData = async () => {
      setLoading(true);

      try {
        // --- 1️⃣ Ambil data utama secara paralel ---
        const [trendingRes, movieRes, seriesRes, nowRes] = await Promise.all([
          axios.get("https://api.themoviedb.org/3/trending/movie/day", {
            ...apiConfig,
            signal: controller.signal,
          }),
          axios.get("https://api.themoviedb.org/3/discover/movie", {
            ...apiConfig,
            signal: controller.signal,
          }),
          axios.get("https://api.themoviedb.org/3/discover/tv", {
            ...apiConfig,
            signal: controller.signal,
          }),
          axios.get("https://api.themoviedb.org/3/movie/now_playing", {
            ...apiConfig,
            signal: controller.signal,
          }),
        ]);

        // --- 2️⃣ Set data ke state ---
        const trendingResults = trendingRes.data?.results || [];
        const firstTrending = trendingResults[0];

        setTrendingMovie(firstTrending);
        setTrending(trendingResults);
        setMovies(movieRes.data?.results || []);
        setSeries(seriesRes.data?.results || []);
        setNowPlaying(nowRes.data?.results || []);

        // --- 3️⃣ Ambil trailer dari YouTube ---
        if (firstTrending?.id) {
          const videoRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${firstTrending.id}/videos`,
            {
              ...apiHeaders,
              params: { language: "en-US" },
              signal: controller.signal,
            }
          );

          const trailer = videoRes.data?.results?.find(
            (vid) => vid.type === "Trailer" && vid.site === "YouTube"
          );

          if (trailer) setTrailerKey(trailer.key);
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request dibatalkan:", err.message);
        } else {
          console.error("Gagal mengambil data dari TMDB:", err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup untuk batalkan request saat unmount
    return () => controller.abort();
  }, []);

  return (
    <div>
      <HomeView
        trendingMovie={trendingMovie}
        trailerKey={trailerKey}
        movies={movies}
        series={series}
        trending={trending}
        nowPlaying={nowPlaying}
        loading={loading}
        // Props kontrol suara
        isMuted={isMuted}
        toggleSound={toggleSound}
      />
    </div>
  );
};

export default Home;
