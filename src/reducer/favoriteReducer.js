// src/reducer/favoriteReducer.js

// Ambil data dari localStorage dengan try/catch supaya aman
let storedFavorites;
try {
  storedFavorites = JSON.parse(localStorage.getItem("favorites")) || { films: [], series: [] };
} catch {
  storedFavorites = { films: [], series: [] };
}

const initialState = {
  films: Array.isArray(storedFavorites.films) ? storedFavorites.films : [],
  series: Array.isArray(storedFavorites.series) ? storedFavorites.series : [],
};

export const favoriteReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_FAVORITE": {
      const { item, itemType } = action.payload; // itemType harus "films" atau "series"

      if (!item || !item.id) return state; // aman kalau item atau id undefined
      if (itemType !== "films" && itemType !== "series") return state; // aman kalau itemType salah

      // Cegah duplikat
      if (state[itemType].some(f => f.id === item.id)) return state;

      const updatedList = [...state[itemType], item];
      const newState = { ...state, [itemType]: updatedList };

      try {
        localStorage.setItem("favorites", JSON.stringify(newState));
      } catch (err) {
        console.error("Failed to save favorites to localStorage:", err);
      }

      return newState;
    }

    case "REMOVE_FAVORITE": {
      const { id, itemType } = action.payload;
      if (!id) return state;
      if (itemType !== "films" && itemType !== "series") return state;

      const filtered = state[itemType].filter(f => f.id !== id);
      const updatedState = { ...state, [itemType]: filtered };

      try {
        localStorage.setItem("favorites", JSON.stringify(updatedState));
      } catch (err) {
        console.error("Failed to save favorites to localStorage:", err);
      }

      return updatedState;
    }

    default:
      return state;
  }
};

// Action creators
export const addFavorite = (item, itemType) => ({
  type: "ADD_FAVORITE",
  payload: { item, itemType },
});

export const removeFavorite = (id, itemType) => ({
  type: "REMOVE_FAVORITE",
  payload: { id, itemType },
});
