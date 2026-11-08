import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import weatherReducer from '../features/weather/weatherSlice';
import settingsReducer from '../features/settings/settingsSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';

export const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      weather: weatherReducer,
      settings: settingsReducer,
      favorites: favoritesReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });

export const renderWithProviders = (
  ui,
  { preloadedState = {}, store = createTestStore(preloadedState) } = {}
) => {
  const result = render(<Provider store={store}>{ui}</Provider>);
  return { ...result, store };
};
