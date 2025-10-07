// src/reducer/detailReducer.js // Komentar: File reducer untuk detail

export const initialState = { // Mengekspor state awal
  film: null, // Film awalnya null
  trailerKey: null, // Trailer key awalnya null
  loading: true, // Loading awalnya true
  error: null, // Error awalnya null
};

export const detailReducer = (state, action) => { // Mengekspor fungsi reducer
  switch (action.type) { // Switch berdasarkan tipe aksi
    case "LOADING": // Kasus LOADING
      return { ...state, loading: true, error: null }; // Mengembalikan state dengan loading true dan error null

    case "SUCCESS": // Kasus SUCCESS
      return { // Mengembalikan state
        ...state, // Spread state
        loading: false, // Loading false
        film: action.payload.film, // Film dari payload
        trailerKey: action.payload.trailerKey, // Trailer key dari payload
      };

    case "ERROR": // Kasus ERROR
      return { ...state, loading: false, error: action.payload }; // Mengembalikan state dengan loading false dan error dari payload

    default: // Default
      return state; // Mengembalikan state tanpa perubahan
  }
};
