import { configureStore } from "@reduxjs/toolkit";
import { favoriteReducer } from "../reducer/favoriteReducer"; // 🧠 named import

const Store = configureStore({
  reducer: {
    favorite: favoriteReducer,
  },
});

export default Store;
