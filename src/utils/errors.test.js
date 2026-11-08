import { describe, expect, test } from 'vitest';
import { getGeolocationErrorMessage, getWeatherErrorMessage } from './errors';

describe('error utilities', () => {
  test('handles missing API key and city not found', () => {
    expect(getWeatherErrorMessage({ code: 'MISSING_API_KEY' })).toMatch(/API key/);
    expect(getWeatherErrorMessage({ code: 'CITY_NOT_FOUND' })).toMatch(
      /No hemos encontrado/
    );
  });

  test('maps HTTP status codes', () => {
    expect(getWeatherErrorMessage({ response: { status: 401 } })).toMatch(
      /no es válida/
    );
    expect(getWeatherErrorMessage({ response: { status: 404 } })).toMatch(
      /No hay datos/
    );
    expect(getWeatherErrorMessage({ response: { status: 429 } })).toMatch(
      /consultas/
    );
  });

  test('handles network errors and API messages', () => {
    expect(getWeatherErrorMessage({ code: 'ERR_NETWORK' })).toMatch(/conectar/);
    expect(
      getWeatherErrorMessage({ response: { data: { message: 'Custom' } } })
    ).toBe('Custom');
    expect(getWeatherErrorMessage({})).toMatch(/No se pudo cargar/);
  });

  test('maps geolocation errors', () => {
    expect(getGeolocationErrorMessage({ code: 1 })).toMatch(/bloqueado/);
    expect(getGeolocationErrorMessage({ code: 2 })).toMatch(/determinar/);
    expect(getGeolocationErrorMessage({ code: 3 })).toMatch(/tardado/);
    expect(getGeolocationErrorMessage({})).toMatch(/No se pudo/);
  });
});
