import { describe, expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';
import weatherService from '../services/weatherService';
import { renderWithProviders } from '../test/renderWithProviders';
import { cities } from '../test/fixtures';

vi.mock('../services/weatherService', () => ({
  default: {
    searchCities: vi.fn(),
    reverseGeocode: vi.fn(),
    fetchCurrentWeather: vi.fn(),
    fetchForecast: vi.fn(),
    fetchWeatherBundle: vi.fn(),
    fetchWeatherByCity: vi.fn(),
  },
}));

describe('SearchBar', () => {
  test('shows city suggestions and selects one', async () => {
    weatherService.searchCities.mockResolvedValue(cities);
    const onSelectCity = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <SearchBar onSearch={vi.fn()} onSelectCity={onSelectCity} />
    );

    await user.type(screen.getByRole('combobox'), 'Madrid');

    expect(
      await screen.findByText('Comunidad de Madrid · ES', {}, { timeout: 2000 })
    ).toBeInTheDocument();

    await user.click(screen.getByText('Madrid', { selector: 'span' }));
    expect(onSelectCity).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Madrid', lat: 40.4168 })
    );
  });

  test('submits a free-text search with Enter', async () => {
    weatherService.searchCities.mockResolvedValue([]);
    const onSearch = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <SearchBar onSearch={onSearch} onSelectCity={vi.fn()} />
    );

    await user.type(screen.getByRole('combobox'), 'Valencia{Enter}');

    expect(onSearch).toHaveBeenCalledWith('Valencia');
  });

  test('shows a message when there are no results', async () => {
    weatherService.searchCities.mockResolvedValue([]);
    const user = userEvent.setup();
    renderWithProviders(<SearchBar onSearch={vi.fn()} onSelectCity={vi.fn()} />);

    await user.type(screen.getByRole('combobox'), 'zzzzz');

    expect(
      await screen.findByText(/No hemos encontrado ciudades/, {}, { timeout: 2000 })
    ).toBeInTheDocument();
  });

  test('supports keyboard selection with ArrowDown and Enter', async () => {
    weatherService.searchCities.mockResolvedValue(cities);
    const onSelectCity = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <SearchBar onSearch={vi.fn()} onSelectCity={onSelectCity} />
    );

    const input = screen.getByRole('combobox');
    await user.type(input, 'Madrid');
    await screen.findByText('Comunidad de Madrid · ES', {}, { timeout: 2000 });

    await user.keyboard('{ArrowDown}{Enter}');
    expect(onSelectCity).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Madrid' })
    );
  });
});
