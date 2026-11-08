import { beforeEach, describe, expect, test, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import weatherService from './services/weatherService';
import { createTestStore, renderWithProviders } from './test/renderWithProviders';
import { currentWeather, forecast } from './test/fixtures';

vi.mock('./services/weatherService', () => ({
  default: {
    searchCities: vi.fn(),
    reverseGeocode: vi.fn(),
    fetchCurrentWeather: vi.fn(),
    fetchForecast: vi.fn(),
    fetchWeatherBundle: vi.fn(),
    fetchWeatherByCity: vi.fn(),
  },
}));

const renderApp = () =>
  renderWithProviders(<App />, {
    store: createTestStore({
      weather: {
        location: null,
        current: null,
        forecast: null,
        status: 'idle',
        error: null,
        lastUpdated: null,
      },
      settings: { units: 'metric', theme: 'dark' },
      favorites: { cities: [] },
    }),
  });

describe('App integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    weatherService.fetchWeatherBundle.mockResolvedValue({
      current: currentWeather,
      forecast,
    });
  });

  test('loads the default location and renders the dashboard', async () => {
    renderApp();

    expect(await screen.findByText('Próximas horas')).toBeInTheDocument();
    expect(screen.getAllByText(/Madrid/).length).toBeGreaterThan(0);
    expect(screen.getByText('Cielo claro')).toBeInTheDocument();
    expect(weatherService.fetchWeatherBundle).toHaveBeenCalledWith(
      expect.objectContaining({ units: 'metric' })
    );
  });

  test('switches to imperial units and reloads the weather', async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByText('Próximas horas');

    await user.click(screen.getByRole('button', { name: '°F' }));

    await waitFor(() => {
      expect(weatherService.fetchWeatherBundle).toHaveBeenLastCalledWith(
        expect.objectContaining({ units: 'imperial' })
      );
    });
  });

  test('saves and removes the current city as favorite', async () => {
    const user = userEvent.setup();
    const { store } = renderApp();
    await screen.findByText('Próximas horas');

    await user.click(
      screen.getByRole('button', { name: 'Guardar en favoritos' })
    );
    expect(store.getState().favorites.cities).toHaveLength(1);
    expect(
      screen.getByRole('button', { name: 'Quitar Madrid de favoritos' })
    ).toBeInTheDocument();
  });

  test('uses the browser geolocation', async () => {
    const user = userEvent.setup();
    const getCurrentPosition = vi.fn((success) =>
      success({ coords: { latitude: 10, longitude: 20 } })
    );
    Object.defineProperty(window.navigator, 'geolocation', {
      configurable: true,
      value: { getCurrentPosition },
    });
    renderApp();
    await screen.findByText('Próximas horas');

    await user.click(screen.getByRole('button', { name: 'Usar mi ubicación' }));

    await waitFor(() => {
      expect(weatherService.fetchWeatherBundle).toHaveBeenLastCalledWith(
        expect.objectContaining({ lat: 10, lon: 20 })
      );
    });
  });

  test('shows the error state for invalid API keys', async () => {
    weatherService.fetchWeatherBundle.mockRejectedValue({
      response: { status: 401 },
    });
    renderApp();

    expect(
      await screen.findByText('No pudimos cargar el tiempo')
    ).toBeInTheDocument();
    expect(screen.getByText(/no es válida/)).toBeInTheDocument();
  });
});
