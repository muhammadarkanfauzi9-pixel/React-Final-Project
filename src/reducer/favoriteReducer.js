// Ambil data dari localStorage (kalau gagal, fallback ke default)
let storedFavorites;
try {
  storedFavorites = JSON.parse(localStorage.getItem("favorites")) || { films: [], series: [] };
} catch {
  storedFavorites = { films: [], series: [] };
}

// Initial state untuk redux
const initialState = {
  films: Array.isArray(storedFavorites.films) ? storedFavorites.films : [],
  series: Array.isArray(storedFavorites.series) ? storedFavorites.series : [],
};

// Reducer utama
export const favoriteReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_FAVORITE": {
      const { item, itemType } = action.payload; // Ambil data dari action

      if (!item || !item.id) return state; // Kalau item tidak valid
      if (itemType !== "films" && itemType !== "series") return state; // Kalau tipe salah

      // Cek duplikat
      if (state[itemType].some(f => f.id === item.id)) return state;

      const updatedList = [...state[itemType], item]; // Tambah ke array
      const newState = { ...state, [itemType]: updatedList };

      try {
        localStorage.setItem("favorites", JSON.stringify(newState)); // Simpan ke localStorage
      } catch (err) {
        console.error("Failed to save favorites to localStorage:", err);
      }

      return newState; // Return state baru
    }

    case "REMOVE_FAVORITE": {
      const { id, itemType } = action.payload; // Ambil id & tipe
      if (!id) return state;
      if (itemType !== "films" && itemType !== "series") return state;

      // Filter hapus item
      const filtered = state[itemType].filter(f => f.id !== id);
      const updatedState = { ...state, [itemType]: filtered };

      try {
        localStorage.setItem("favorites", JSON.stringify(updatedState)); // Update localStorage
      } catch (err) {
        console.error("Failed to save favorites to localStorage:", err);
      }

      return updatedState;
    }

    default:
      return state; // Kalau tidak ada action yang cocok
  }
};

// Action creator untuk tambah favorite
export const addFavorite = (item, itemType) => ({
  type: "ADD_FAVORITE",
  payload: { item, itemType },
});

// Action creator untuk hapus favorite
export const removeFavorite = (id, itemType) => ({
  type: "REMOVE_FAVORITE",
  payload: { id, itemType },
});
