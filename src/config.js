const env = import.meta.env;

export const API_KEY =
  env.VITE_OPENWEATHER_API_KEY || env.VITE_API_KEY || '';

export const WEATHER_API_BASE = (
  env.VITE_WEATHER_API_BASE ||
  'https://api.openweathermap.org/data/2.5'
).replace(/\/+$/, '');

export const GEO_API_BASE = (
  env.VITE_GEO_API_BASE || 'https://api.openweathermap.org/geo/1.0'
).replace(/\/+$/, '');

export const DEFAULT_LOCATION = {
  name: 'Madrid',
  country: 'ES',
  lat: 40.4168,
  lon: -3.7038,
};

export const DEFAULT_CITY = (env.VITE_DEFAULT_CITY || '').trim();

export const LOCALE = 'es-ES';

export const UNIT_META = {
  metric: {
    temperature: '°C',
    wind: 'km/h',
    distance: 'km',
    windFactor: 3.6,
    distanceFactor: 1000,
  },
  imperial: {
    temperature: '°F',
    wind: 'mph',
    distance: 'mi',
    windFactor: 1,
    distanceFactor: 1609.344,
  },
};
