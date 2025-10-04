// src/components/Favorite/Favorite.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import FavoriteView from "../../pages/favorite/FavoriteView";

const FavoriteComponent = () => {
  const favorites = useSelector((state) => state.favorite.favorites || []);
  const { theme } = useTheme();

  return <FavoriteView favorites={favorites} theme={theme} />;
};

export default FavoriteComponent;
