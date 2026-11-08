import { describe, expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CurrentWeather from './CurrentWeather';
import { renderWithProviders } from '../test/renderWithProviders';
import { currentWeather } from '../test/fixtures';

const baseProps = {
  current: currentWeather,
  location: { name: 'Madrid', country: 'ES' },
  units: 'metric',
  isFavorite: false,
  onToggleFavorite: vi.fn(),
  onRefresh: vi.fn(),
  lastUpdated: Date.now(),
  refreshing: false,
};

describe('CurrentWeather', () => {
  test('renders the current conditions', () => {
    renderWithProviders(<CurrentWeather {...baseProps} />);

    expect(screen.getByText(/Madrid/)).toBeInTheDocument();
    expect(screen.getByText('22')).toBeInTheDocument();
    expect(screen.getByText('Cielo claro')).toBeInTheDocument();
    expect(screen.getByText(/Máx\. 25°C/)).toBeInTheDocument();
    expect(screen.getByText(/Mín\. 19°C/)).toBeInTheDocument();
  });

  test('fires favorite and refresh actions', async () => {
    const onToggleFavorite = vi.fn();
    const onRefresh = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <CurrentWeather
        {...baseProps}
        onToggleFavorite={onToggleFavorite}
        onRefresh={onRefresh}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Guardar en favoritos' }));
    await user.click(screen.getByRole('button', { name: 'Actualizar el tiempo' }));

    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
