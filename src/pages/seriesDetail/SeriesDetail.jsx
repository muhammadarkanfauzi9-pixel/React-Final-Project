// src/components/Detail/SeriesDetail/SeriesDetail.jsx (Container)

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch } from "react-redux";
import { addFavorite } from "../../reducer/favoriteReducer";
import SeriesDetailView from "./SeriesDetailView"; // 👈 Import komponen tampilan

const SeriesDetail = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const reduxDispatch = useDispatch();

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        // Fetch Detail Series
        const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}`, {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + import.meta.env.VITE_KEY_TMDB,
          },
        });
        setSeries(res.data);

        // Fetch Trailer
        const trailerRes = await axios.get(`https://api.themoviedb.org/3/tv/${id}/videos`, {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + import.meta.env.VITE_KEY_TMDB,
          },
        });
        const trailer = trailerRes.data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setTrailerKey(trailer ? trailer.key : null);

        // Fetch Cast
        const castRes = await axios.get(`https://api.themoviedb.org/3/tv/${id}/credits`, {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + import.meta.env.VITE_KEY_TMDB,
          },
        });
        setCast(castRes.data.cast.slice(0, 10));

        // Fetch Similar
        const similarRes = await axios.get(`https://api.themoviedb.org/3/tv/${id}/similar`, {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + import.meta.env.VITE_KEY_TMDB,
          },
        });
        setSimilar(similarRes.data.results);
      } catch (err) {
        console.error("Gagal ambil data series:", err.message);
      }
    };

    fetchSeries(); 
  }, [id]); 

  const handleFavorite = () => {
    if (series) {
      reduxDispatch(addFavorite(series, "series")); 
      alert(`🎉 ${series.name} ditambahkan ke Favorite!`);
    }
  };

  if (!series) {
    // Menampilkan loading di sini, di komponen Container
    return <p className="text-center text-white">Loading...</p>;
  }

  // Meneruskan semua data dan fungsi yang diperlukan ke komponen tampilan
  return (
    <SeriesDetailView 
      series={series}
      trailerKey={trailerKey}
      cast={cast}
      similar={similar}
      theme={theme}
      handleFavorite={handleFavorite}
    />
  );
};

export default SeriesDetail;