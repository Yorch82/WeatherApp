import axios from 'axios';
import {
  API_KEY,
  GEO_API_BASE,
  WEATHER_API_BASE,
} from '../config';

const weatherApi = axios.create({
  baseURL: WEATHER_API_BASE,
  timeout: 12000,
});

const geoApi = axios.create({
  baseURL: GEO_API_BASE,
  timeout: 12000,
});

const assertApiKey = () => {
  if (!API_KEY) {
    const error = new Error('MISSING_API_KEY');
    error.code = 'MISSING_API_KEY';
    throw error;
  }
};

const normalizeCity = (city) => ({
  id: city.id ?? `${city.lat},${city.lon}`,
  name: city.name,
  state: city.state ?? '',
  country: city.country ?? '',
  lat: Number(city.lat),
  lon: Number(city.lon),
  label: [city.name, city.state, city.country].filter(Boolean).join(', '),
});

export const searchCities = async (query, limit = 6) => {
  assertApiKey();
  const trimmed = String(query ?? '').trim();
  if (trimmed.length < 2) return [];

  const { data } = await geoApi.get('/direct', {
    params: {
      q: trimmed,
      limit,
      appid: API_KEY,
      lang: 'es',
    },
  });

  return Array.isArray(data) ? data.map(normalizeCity) : [];
};

export const reverseGeocode = async (lat, lon) => {
  assertApiKey();
  const { data } = await geoApi.get('/reverse', {
    params: {
      lat,
      lon,
      limit: 1,
      appid: API_KEY,
      lang: 'es',
    },
  });

  return Array.isArray(data) && data.length > 0 ? normalizeCity(data[0]) : null;
};

export const fetchCurrentWeather = async ({ lat, lon, units = 'metric' }) => {
  assertApiKey();
  const { data } = await weatherApi.get('/weather', {
    params: { lat, lon, units, lang: 'es', appid: API_KEY },
  });
  return data;
};

export const fetchForecast = async ({ lat, lon, units = 'metric' }) => {
  assertApiKey();
  const { data } = await weatherApi.get('/forecast', {
    params: { lat, lon, units, lang: 'es', appid: API_KEY },
  });
  return data;
};

export const fetchWeatherBundle = async ({ lat, lon, units = 'metric' }) => {
  const [current, forecast] = await Promise.all([
    fetchCurrentWeather({ lat, lon, units }),
    fetchForecast({ lat, lon, units }),
  ]);
  return { current, forecast };
};

export const fetchWeatherByCity = async (query, units = 'metric') => {
  const cities = await searchCities(query, 1);
  if (cities.length === 0) {
    const error = new Error('CITY_NOT_FOUND');
    error.code = 'CITY_NOT_FOUND';
    throw error;
  }

  const [city] = cities;
  const bundle = await fetchWeatherBundle({
    lat: city.lat,
    lon: city.lon,
    units,
  });

  return {
    ...bundle,
    location: {
      lat: city.lat,
      lon: city.lon,
      name: city.name,
      country: city.country,
      state: city.state,
    },
  };
};

const weatherService = {
  searchCities,
  reverseGeocode,
  fetchCurrentWeather,
  fetchForecast,
  fetchWeatherBundle,
  fetchWeatherByCity,
};

export default weatherService;
