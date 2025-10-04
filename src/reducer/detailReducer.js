// src/reducer/detailReducer.js

export const initialState = {
  film: null,
  trailerKey: null,
  loading: true,
  error: null,
};

export const detailReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: null };

    case "SUCCESS":
      return {
        ...state,
        loading: false,
        film: action.payload.film,
        trailerKey: action.payload.trailerKey,
      };

    case "ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
