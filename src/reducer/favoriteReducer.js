// Ambil data dari localStorage (kalau gagal, fallback ke default) // Komentar: Mengambil data favorit dari localStorage dengan fallback
let storedFavorites; // Mendeklarasikan variabel untuk data tersimpan
try { // Mencoba parsing JSON dari localStorage
  storedFavorites = JSON.parse(localStorage.getItem("favorites")) || { films: [], series: [] }; // Parsing atau default
} catch { // Jika error
  storedFavorites = { films: [], series: [] }; // Menggunakan default
}

// Initial state untuk redux // Komentar: State awal untuk Redux
const initialState = { // Mendefinisikan state awal
  films: Array.isArray(storedFavorites.films) ? storedFavorites.films : [], // Films dari storage atau array kosong
  series: Array.isArray(storedFavorites.series) ? storedFavorites.series : [], // Series dari storage atau array kosong
};

// Reducer utama // Komentar: Fungsi reducer utama
export const favoriteReducer = (state = initialState, action) => { // Mengekspor reducer dengan default state
  switch (action.type) { // Switch berdasarkan tipe aksi
    case "ADD_FAVORITE": { // Kasus ADD_FAVORITE
      const { item, itemType } = action.payload; // Mengambil item dan itemType dari payload

      if (!item || !item.id) return state; // Jika item tidak valid, kembalikan state
      if (itemType !== "films" && itemType !== "series") return state; // Jika tipe tidak valid, kembalikan state

      // Cek duplikat // Komentar: Memeriksa duplikat
      if (state[itemType].some(f => f.id === item.id)) return state; // Jika duplikat, kembalikan state

      const updatedList = [...state[itemType], item]; // Menambahkan item ke list
      const newState = { ...state, [itemType]: updatedList }; // Membuat state baru

      try { // Mencoba menyimpan ke localStorage
        localStorage.setItem("favorites", JSON.stringify(newState)); // Menyimpan state baru
      } catch (err) { // Jika error
        console.error("Failed to save favorites to localStorage:", err); // Mencetak error
      }

      return newState; // Mengembalikan state baru
    }

    case "REMOVE_FAVORITE": { // Kasus REMOVE_FAVORITE
      const { id, itemType } = action.payload; // Mengambil id dan itemType dari payload
      if (!id) return state; // Jika id tidak ada, kembalikan state
      if (itemType !== "films" && itemType !== "series") return state; // Jika tipe tidak valid, kembalikan state

      // Filter hapus item // Komentar: Menghapus item dengan filter
      const filtered = state[itemType].filter(f => f.id !== id); // Memfilter list
      const updatedState = { ...state, [itemType]: filtered }; // Membuat state baru

      try { // Mencoba menyimpan ke localStorage
        localStorage.setItem("favorites", JSON.stringify(updatedState)); // Menyimpan state baru
      } catch (err) { // Jika error
        console.error("Failed to save favorites to localStorage:", err); // Mencetak error
      }

      return updatedState; // Mengembalikan state baru
    }

    default: // Default case
      return state; // Mengembalikan state tanpa perubahan
  }
};

// Action creator untuk tambah favorite // Komentar: Creator aksi untuk menambah favorit
export const addFavorite = (item, itemType) => ({ // Mengekspor fungsi creator
  type: "ADD_FAVORITE", // Tipe aksi
  payload: { item, itemType }, // Payload
});

// Action creator untuk hapus favorite // Komentar: Creator aksi untuk menghapus favorit
export const removeFavorite = (id, itemType) => ({ // Mengekspor fungsi creator
  type: "REMOVE_FAVORITE", // Tipe aksi
  payload: { id, itemType }, // Payload
});
