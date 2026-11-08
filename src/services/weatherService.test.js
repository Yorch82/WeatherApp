import { beforeEach, describe, expect, test, vi } from 'vitest';
import weatherService from './weatherService';
import { currentWeather, forecast, cities } from '../test/fixtures';

const mocks = vi.hoisted(() => ({
  weatherGet: vi.fn(),
  geoGet: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    create: vi.fn((config) =>
      config.baseURL.includes('geo')
        ? { get: mocks.geoGet }
        : { get: mocks.weatherGet }
    ),
  },
}));

describe('weatherService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.weatherGet.mockReset();
    mocks.geoGet.mockReset();
  });

  test('does not search for very short queries', async () => {
    const result = await weatherService.searchCities('M');
    expect(result).toEqual([]);
    expect(mocks.geoGet).not.toHaveBeenCalled();
  });

  test('searches cities and normalizes the response', async () => {
    mocks.geoGet.mockResolvedValue({ data: cities });

    const result = await weatherService.searchCities('Madrid');

    expect(mocks.geoGet).toHaveBeenCalledWith('/direct', {
      params: {
        q: 'Madrid',
        limit: 6,
        appid: 'test-api-key',
        lang: 'es',
      },
    });
    expect(result[0]).toEqual(
      expect.objectContaining({
        name: 'Madrid',
        country: 'ES',
        lat: 40.4168,
        lon: -3.7038,
      })
    );
  });

  test('reverse geocodes coordinates', async () => {
    mocks.geoGet.mockResolvedValue({ data: [cities[0]] });
    const result = await weatherService.reverseGeocode(40.4, -3.7);
    expect(mocks.geoGet).toHaveBeenCalledWith('/reverse', {
      params: {
        lat: 40.4,
        lon: -3.7,
        limit: 1,
        appid: 'test-api-key',
        lang: 'es',
      },
    });
    expect(result.name).toBe('Madrid');
  });

  test('returns null when reverse geocoding has no result', async () => {
    mocks.geoGet.mockResolvedValue({ data: [] });
    expect(await weatherService.reverseGeocode(0, 0)).toBeNull();
  });

  test('fetches current weather and forecast', async () => {
    mocks.weatherGet
      .mockResolvedValueOnce({ data: currentWeather })
      .mockResolvedValueOnce({ data: forecast });

    const result = await weatherService.fetchWeatherBundle({
      lat: 40.4,
      lon: -3.7,
      units: 'metric',
    });

    expect(mocks.weatherGet).toHaveBeenNthCalledWith(1, '/weather', {
      params: {
        lat: 40.4,
        lon: -3.7,
        units: 'metric',
        lang: 'es',
        appid: 'test-api-key',
      },
    });
    expect(mocks.weatherGet).toHaveBeenNthCalledWith(2, '/forecast', {
      params: {
        lat: 40.4,
        lon: -3.7,
        units: 'metric',
        lang: 'es',
        appid: 'test-api-key',
      },
    });
    expect(result.current.name).toBe('Madrid');
    expect(result.forecast.list).toHaveLength(40);
  });

  test('fetches weather by city', async () => {
    mocks.geoGet.mockResolvedValue({ data: [cities[0]] });
    mocks.weatherGet
      .mockResolvedValueOnce({ data: currentWeather })
      .mockResolvedValueOnce({ data: forecast });

    const result = await weatherService.fetchWeatherByCity('Madrid');

    expect(result.location).toEqual(
      expect.objectContaining({ name: 'Madrid', country: 'ES' })
    );
  });

  test('throws CITY_NOT_FOUND when geocoding returns no cities', async () => {
    mocks.geoGet.mockResolvedValue({ data: [] });

    await expect(weatherService.fetchWeatherByCity('Atlantis')).rejects.toMatchObject(
      { code: 'CITY_NOT_FOUND' }
    );
  });
});
