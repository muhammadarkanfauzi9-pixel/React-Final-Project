  // src/components/Detail/FilmDetail/FilmDetail.jsx
  import React, { useEffect, useReducer } from "react";
  import { useParams } from "react-router-dom";
  import axios from "axios";
  import FilmDetailView from "./FilmDetailView";
  import { detailReducer, initialState } from "../../reducer/detailReducer";
  import { useDispatch } from "react-redux";
  import { addFavorite } from "../../reducer/favoriteReducer";

  const FilmDetail = () => {
    const { id } = useParams();
    const [state, localDispatch] = useReducer(detailReducer, initialState);
    const reduxDispatch = useDispatch();
    const { film, trailerKey, loading, error } = state;

    useEffect(() => {
      const fetchFilm = async () => {
        localDispatch({ type: "LOADING" });
        try {
          const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
            headers: {
              accept: "application/json",
              Authorization: "Bearer " + import.meta.env.VITE_KEY_TMDB,
            },
          });

          const videoRes = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos`, {
            headers: {
              accept: "application/json",
              Authorization: "Bearer " + import.meta.env.VITE_KEY_TMDB,
            },
          });

          const trailer = videoRes.data.results.find(
            (vid) => vid.type === "Trailer" && vid.site === "YouTube"
          );

          localDispatch({
            type: "SUCCESS",
            payload: { film: res.data, trailerKey: trailer ? trailer.key : null },
          });
        } catch (err) {
          console.error("❌ Gagal fetch:", err);
          localDispatch({ type: "ERROR", payload: err.message });
        }
      };

      if (id) fetchFilm();
    }, [id]);

    const handleFavorite = () => {
      if (film) {
        reduxDispatch(addFavorite(film, "films")); // gunakan "films" sesuai reducer
        alert(`🎉 ${film.title} ditambahkan ke Favorite!`);
      }
    };

    if (loading) return <p className="text-center text-white">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;
    if (!film) return null;

    return (
      <div className="relative">
        {/* Tombol Favorite */}
        <button
          onClick={handleFavorite}
          className="absolute top-4 right-6 z-20 bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
          title="Tambah ke Favorite"
        >
          ❤️
        </button>

        {/* Komponen view film detail */}
        <FilmDetailView film={film} trailerKey={trailerKey} />
      </div>
    );
  };

  export default FilmDetail;
