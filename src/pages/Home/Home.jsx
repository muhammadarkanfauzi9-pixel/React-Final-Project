import React, { useState, useEffect } from "react";
import axios from "axios";
import HomeView from "./HomeView";

const Home = () => {
  const [trendingMovie, setTrendingMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  // state list lain
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [trending, setTrending] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);

  const [loading, setLoading] = useState(true);

  const apiHeaders = {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + import.meta.env.VITE_KEY_TMDB,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. trending movie for backdrop
        const trendingRes = await axios.get(
          "https://api.themoviedb.org/3/trending/movie/day",
          apiHeaders
        );
        const firstTrending = trendingRes.data.results[0];
        setTrendingMovie(firstTrending);
        setTrending(trendingRes.data.results);

        // ambil trailer
        const videoRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${firstTrending.id}/videos`,
          apiHeaders
        );
        const trailer = videoRes.data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (trailer) setTrailerKey(trailer.key);

        // 2. list movie
        const movieRes = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          apiHeaders
        );
        setMovies(movieRes.data.results);

        // 3. list series
        const seriesRes = await axios.get(
          "https://api.themoviedb.org/3/discover/tv",
          apiHeaders
        );
        setSeries(seriesRes.data.results);

        // 4. now playing
        const nowRes = await axios.get(
          "https://api.themoviedb.org/3/movie/now_playing",
          apiHeaders
        );
        setNowPlaying(nowRes.data.results);

      } catch (err) {
        console.error("Error fetch data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      />
    </div>
  );
};

export default Home;
