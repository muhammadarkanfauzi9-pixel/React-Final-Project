// src/pages/favorite/FavoriteView.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { removeFavorite } from "../../reducer/favoriteReducer";

const FavoriteView = () => {
  const dispatch = useDispatch();
  const { films, series } = useSelector((state) => state.favorite);
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true); // 🌀 state loading

  useEffect(() => {
    // Simulasi delay untuk loading (bisa dihapus kalau mau instant)
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Warna fade sesuai tema
  const fadeColor = theme === "dark" ? "from-[#1d232a]" : "from-white";

// Fungsi hapus favorit
const handleRemove = (id, type) => {
  const typeText = type === "films" ? "movie" : "series";
  const confirmDelete = window.confirm(`Yakin menghapus ${typeText}?`);

  if (confirmDelete) {
    dispatch(removeFavorite(id, type));
  }
};


  const renderCard = (item, type) => {
    const path = type === "film" ? `/film/${item.id}` : `/series/${item.id}`;

    return (
      <div
        key={`${type}-${item.id}`}
        className="relative w-[250px] h-[380px] flex-shrink-0 group rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w500${item.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay Gradient (bottom fade) */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>

        {/* Card Content */}
        <div className="absolute bottom-0 p-4 w-full z-10">
          <h2 className="text-lg text-center font-semibold mb-2 text-white">
            {item.original_title ||
              item.title ||
              item.name ||
              item.original_name}
          </h2>
          <p className="text-sm overflow-hidden transition-all duration-500 ease-in-out max-h-12 group-hover:max-h-40 text-center text-gray-300">
            {item.overview || "No overview available."}
          </p>
          <p className="text-white font-bold mt-2">
            ⭐ {item.vote_average?.toFixed(1)}
          </p>
          <p className="text-red-600 font-semibold mb-3">
            {item.release_date
              ? `Release: ${item.release_date}`
              : `First Air: ${item.first_air_date}`}
          </p>

          {/* Tombol Hapus */}
          <button
            onClick={() =>
              handleRemove(item.id, type === "film" ? "films" : "series")
            }
            className="w-full py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md transition-all"
          >
            Hapus
          </button>
        </div>

        {/* Clickable area di atas tombol */}
        <Link
          to={path}
          className="absolute inset-0 z-0"
          aria-label="View details"
        ></Link>
      </div>
    );
  };

  const renderSection = (items, title, type) => (
    <div className="mb-12 relative">
      <h3 className="text-xl font-semibold mb-4 text-purple-400">{title}</h3>

      {items.length === 0 ? (
        <p className="text-gray-400">
          Belum ada {type} favorit yang ditambahkan 😢
        </p>
      ) : (
        <div className="relative">
          {/* Gradient kiri */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r ${fadeColor} to-transparent pointer-events-none z-10`}
          />
          {/* Gradient kanan */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l ${fadeColor} to-transparent pointer-events-none z-10`}
          />

          {/* Scrollable flex */}
          <div className="overflow-x-auto scroll-smooth pb-4">
            <div className="flex justify-center space-x-6 relative z-0 overflow-visible">
              {items
                .slice()
                .reverse()
                .map((item) => renderCard(item, type))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 🔹 Tampilan loading
  if (loading) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen ${
          theme === "dark" ? "bg-[#1d232a] text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-t-transparent border-red-600 rounded-full animate-spin mb-3"></div>
          <p className="text-lg font-semibold">Memuat favoritmu...</p>
        </div>
      </div>
    );
  }

  // 🔹 Tampilan utama
  return (
    <div
      className={`relative px-0 py-3 min-h-screen ${
        theme === "dark" ? "bg-[#1d232a] text-white" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-2xl font-bold my-2 text-red-600">Favorite</h1>
      <h2
        className={`font-bold mb-6 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        Film & Series favoritmu tersimpan di sini
      </h2>

      {/* Section Movies */}
      {renderSection(films, "🎬 Movies", "film")}

      {/* Section Series */}
      {renderSection(series, "📺 Series", "series")}
    </div>
  );
};

export default FavoriteView;
