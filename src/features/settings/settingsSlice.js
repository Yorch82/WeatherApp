import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const initialState = {
  units: 'metric',
  theme: getInitialTheme(),
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setUnits: (state, action) => {
      state.units = action.payload === 'imperial' ? 'imperial' : 'metric';
    },
    toggleUnits: (state) => {
      state.units = state.units === 'metric' ? 'imperial' : 'metric';
    },
    setTheme: (state, action) => {
      state.theme = action.payload === 'light' ? 'light' : 'dark';
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
  },
});

export const { setUnits, toggleUnits, setTheme, toggleTheme } =
  settingsSlice.actions;

export const selectUnits = (state) => state.settings.units;
export const selectTheme = (state) => state.settings.theme;

export default settingsSlice.reducer;
