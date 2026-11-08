import { beforeEach, describe, expect, test, vi } from 'vitest';
import weatherService from '../../services/weatherService';
import {
  clearWeather,
  loadWeatherByCity,
  loadWeatherByCoords,
  refreshWeather,
  selectCurrentWeather,
  selectLocation,
  selectWeatherError,
  selectWeatherStatus,
} from './weatherSlice';
import { createTestStore } from '../../test/renderWithProviders';
import { currentWeather, forecast } from '../../test/fixtures';

vi.mock('../../services/weatherService', () => ({
  default: {
    searchCities: vi.fn(),
    reverseGeocode: vi.fn(),
    fetchCurrentWeather: vi.fn(),
    fetchForecast: vi.fn(),
    fetchWeatherBundle: vi.fn(),
    fetchWeatherByCity: vi.fn(),
  },
}));

const makeStore = (settings = { units: 'metric', theme: 'dark' }) =>
  createTestStore({
    settings,
    weather: {
      location: null,
      current: null,
      forecast: null,
      status: 'idle',
      error: null,
      lastUpdated: null,
    },
  });

describe('weather slice', () => {
  beforeEach(() => vi.clearAllMocks());

  test('loads weather by coordinates', async () => {
    weatherService.fetchWeatherBundle.mockResolvedValue({
      current: currentWeather,
      forecast,
    });
    const store = makeStore();

    await store.dispatch(
      loadWeatherByCoords({ lat: 40.4168, lon: -3.7038 })
    ).unwrap();

    const state = store.getState();
    expect(state.weather.status).toBe('succeeded');
    expect(state.weather.location.name).toBe('Madrid');
    expect(state.weather.location.country).toBe('ES');
    expect(state.weather.lastUpdated).toEqual(expect.any(Number));
    expect(selectCurrentWeather(state).main.temp).toBe(22.4);
    expect(selectWeatherStatus(state)).toBe('succeeded');
  });

  test('passes selected units to the service', async () => {
    weatherService.fetchWeatherBundle.mockResolvedValue({
      current: currentWeather,
      forecast,
    });
    const store = makeStore({ units: 'imperial', theme: 'dark' });

    await store.dispatch(
      loadWeatherByCoords({ lat: 40.4168, lon: -3.7038 })
    ).unwrap();

    expect(weatherService.fetchWeatherBundle).toHaveBeenCalledWith({
      lat: 40.4168,
      lon: -3.7038,
      units: 'imperial',
    });
  });

  test('loads weather by city and keeps the geocoded location', async () => {
    weatherService.fetchWeatherByCity.mockResolvedValue({
      current: currentWeather,
      forecast,
      location: { name: 'Madrid', country: 'ES', lat: 40.4168, lon: -3.7038 },
    });
    const store = makeStore();

    await store.dispatch(loadWeatherByCity('Madrid')).unwrap();

    expect(weatherService.fetchWeatherByCity).toHaveBeenCalledWith(
      'Madrid',
      'metric'
    );
    expect(selectLocation(store.getState()).name).toBe('Madrid');
  });

  test('maps city-not-found errors', async () => {
    const error = new Error('CITY_NOT_FOUND');
    error.code = 'CITY_NOT_FOUND';
    weatherService.fetchWeatherByCity.mockRejectedValue(error);
    const store = makeStore();

    await store.dispatch(loadWeatherByCity('Atlantis'));

    expect(selectWeatherStatus(store.getState())).toBe('failed');
    expect(selectWeatherError(store.getState())).toMatch(/No hemos encontrado/);
  });

  test('maps invalid API key errors', async () => {
    weatherService.fetchWeatherBundle.mockRejectedValue({
      response: { status: 401 },
    });
    const store = makeStore();

    await store.dispatch(
      loadWeatherByCoords({ lat: 1, lon: 2 })
    );

    expect(selectWeatherError(store.getState())).toMatch(/no es válida/);
  });

  test('refreshes the saved location', async () => {
    weatherService.fetchWeatherBundle.mockResolvedValue({
      current: currentWeather,
      forecast,
    });
    const store = makeStore();
    store.dispatch({
      type: 'weather/loadByCoords/fulfilled',
      payload: {
        current: currentWeather,
        forecast,
        location: {
          lat: 40.4168,
          lon: -3.7038,
          name: 'Madrid',
          country: 'ES',
          key: '40.42,-3.70',
        },
      },
    });

    await store.dispatch(refreshWeather()).unwrap();

    expect(weatherService.fetchWeatherBundle).toHaveBeenCalledWith({
      lat: 40.4168,
      lon: -3.7038,
      units: 'metric',
    });
  });

  test('clearWeather resets the state', () => {
    const store = makeStore();
    store.dispatch({
      type: 'weather/loadByCoords/fulfilled',
      payload: {
        current: currentWeather,
        forecast,
        location: { lat: 1, lon: 2, name: 'X', country: 'ES', key: '1.00,2.00' },
      },
    });
    store.dispatch(clearWeather());
    expect(selectCurrentWeather(store.getState())).toBeNull();
    expect(selectLocation(store.getState())).toBeNull();
  });
});
