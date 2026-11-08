import { describe, expect, test } from 'vitest';
import {
  formatCity,
  formatDayLabel,
  formatHourFromOffset,
  formatPercent,
  formatPressure,
  formatTemperature,
  formatVisibility,
  formatWind,
  getDailyForecast,
  getHourlyForecast,
  getLocationKey,
  getSunTimes,
  getUnitMeta,
  getWeatherDescription,
  getWeatherIcon,
  getWeatherTheme,
  getWindDirection,
  roundTemperature,
} from './weather';
import { currentWeather, forecast } from '../test/fixtures';

describe('weather utilities', () => {
  test('unit metadata and temperature formatting', () => {
    expect(getUnitMeta('metric').wind).toBe('km/h');
    expect(getUnitMeta('imperial').wind).toBe('mph');
    expect(getUnitMeta('unknown').temperature).toBe('°C');
    expect(roundTemperature(21.6)).toBe(22);
    expect(roundTemperature('x')).toBeNull();
    expect(formatTemperature(21.6, 'metric')).toBe('22°C');
    expect(formatTemperature(72.1, 'imperial')).toBe('72°F');
    expect(formatTemperature(21.6, 'metric', false)).toBe('22');
    expect(formatTemperature(null)).toBe('—');
  });

  test('formats wind and visibility in both unit systems', () => {
    expect(formatWind(10, 'metric')).toBe('36 km/h');
    expect(formatWind(10, 'imperial')).toBe('10 mph');
    expect(formatWind(undefined)).toBe('—');
    expect(formatVisibility(10000, 'metric')).toBe('10 km');
    expect(formatVisibility(1609.344, 'imperial')).toBe('1.0 mi');
    expect(formatVisibility(500, 'metric')).toBe('500 m');
  });

  test('formats pressure, percent and city', () => {
    expect(formatPressure(1015.4)).toBe('1015 hPa');
    expect(formatPercent(45.6)).toBe('46%');
    expect(formatCity('Madrid', 'ES')).toBe('Madrid, ES');
    expect(formatCity(null)).toBe('Ubicación desconocida');
  });

  test('converts wind degrees to compass directions', () => {
    expect(getWindDirection(0)).toBe('N');
    expect(getWindDirection(90)).toBe('E');
    expect(getWindDirection(180)).toBe('S');
    expect(getWindDirection(270)).toBe('O');
    expect(getWindDirection(225)).toBe('SO');
    expect(getWindDirection(null)).toBe('—');
  });

  test('returns safe weather icons', () => {
    expect(getWeatherIcon('10d')).toBe('/images/weather_icons/10d.png');
    expect(getWeatherIcon('../../evil')).toBe('/images/weather_icons/01d.png');
    expect(getWeatherIcon(undefined)).toBe('/images/weather_icons/01d.png');
  });

  test('derives weather themes from condition ids and day/night icons', () => {
    expect(getWeatherTheme({ weather: [{ id: 800, icon: '01d' }] })).toBe(
      'clear-day'
    );
    expect(getWeatherTheme({ weather: [{ id: 800, icon: '01n' }] })).toBe(
      'clear-night'
    );
    expect(getWeatherTheme({ weather: [{ id: 802, icon: '03d' }] })).toBe(
      'clouds-day'
    );
    expect(getWeatherTheme({ weather: [{ id: 500, icon: '10d' }] })).toBe('rain');
    expect(getWeatherTheme({ weather: [{ id: 200, icon: '11d' }] })).toBe(
      'storm'
    );
    expect(getWeatherTheme({ weather: [{ id: 600, icon: '13d' }] })).toBe('snow');
    expect(getWeatherTheme({ weather: [{ id: 741, icon: '50d' }] })).toBe('mist');
  });

  test('formats descriptions and city-local times', () => {
    expect(getWeatherDescription(currentWeather)).toBe('Cielo claro');
    expect(getWeatherDescription({})).toBe('Sin datos');
    expect(formatHourFromOffset(currentWeather.dt, currentWeather.timezone)).toMatch(
      /^\d{2}:\d{2}$/
    );
    expect(formatDayLabel('2026-11-08', 2)).toMatch(/^[A-ZÁÉÍÓÚ]/);
    expect(formatDayLabel('2026-11-08', 0)).toBe('Hoy');
    expect(formatDayLabel('2026-11-08', 1)).toBe('Mañana');
  });

  test('gets sun times from the current weather offset', () => {
    const times = getSunTimes(currentWeather);
    expect(times.sunrise).toMatch(/^\d{2}:\d{2}$/);
    expect(times.sunset).toMatch(/^\d{2}:\d{2}$/);
  });

  test('groups hourly and daily forecasts', () => {
    expect(getHourlyForecast(forecast, 4)).toHaveLength(4);
    expect(getHourlyForecast(null)).toEqual([]);

    const days = getDailyForecast(forecast);
    expect(days.length).toBeGreaterThanOrEqual(5);
    expect(days[0].label).toBe('Hoy');
    expect(days[0].min).toBeLessThanOrEqual(days[0].max);
    expect(days[0].pop).toBeGreaterThanOrEqual(0);
    expect(days[0].pop).toBeLessThanOrEqual(1);
  });

  test('builds stable location keys', () => {
    expect(getLocationKey(40.4168, -3.7038)).toBe('40.42,-3.70');
    expect(getLocationKey('bad', 3)).toBeNull();
  });
});
