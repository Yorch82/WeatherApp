import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from '../utils/persistStorage';
import weatherReducer from '../features/weather/weatherSlice';
import settingsReducer from '../features/settings/settingsSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';

const weatherPersistConfig = {
  key: 'meteo-weather',
  storage,
  whitelist: ['location'],
};

const settingsPersistConfig = {
  key: 'meteo-settings',
  storage,
};

const favoritesPersistConfig = {
  key: 'meteo-favorites',
  storage,
};

const rootReducer = combineReducers({
  weather: persistReducer(weatherPersistConfig, weatherReducer),
  settings: persistReducer(settingsPersistConfig, settingsReducer),
  favorites: persistReducer(favoritesPersistConfig, favoritesReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/FLUSH',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PERSIST',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
