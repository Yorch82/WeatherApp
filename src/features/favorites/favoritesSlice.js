import { createSlice } from '@reduxjs/toolkit';
import { getLocationKey } from '../../utils/weather';

const initialState = {
  cities: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const city = action.payload;
      if (!city) return;
      const key = getLocationKey(city.lat, city.lon);
      if (!key) return;
      if (!state.cities.some((item) => getLocationKey(item.lat, item.lon) === key)) {
        state.cities.push({ ...city, key });
      }
    },
    removeFavorite: (state, action) => {
      const key = action.payload;
      state.cities = state.cities.filter(
        (city) => city.key !== key && getLocationKey(city.lat, city.lon) !== key
      );
    },
    toggleFavorite: (state, action) => {
      const city = action.payload;
      if (!city) return;
      const key = getLocationKey(city.lat, city.lon);
      if (!key) return;
      const exists = state.cities.some(
        (item) => item.key === key || getLocationKey(item.lat, item.lon) === key
      );
      if (exists) {
        state.cities = state.cities.filter(
          (item) => item.key !== key && getLocationKey(item.lat, item.lon) !== key
        );
      } else {
        state.cities.push({ ...city, key });
      }
    },
    clearFavorites: (state) => {
      state.cities = [];
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } =
  favoritesSlice.actions;

export const selectFavorites = (state) => state.favorites.cities;
export const selectIsFavorite = (lat, lon) => (state) => {
  const key = getLocationKey(lat, lon);
  return Boolean(
    key &&
      state.favorites.cities.some(
        (city) => city.key === key || getLocationKey(city.lat, city.lon) === key
      )
  );
};

export default favoritesSlice.reducer;
