import { describe, expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorState from './ErrorState';
import FavoritesBar from './FavoritesBar';
import { renderWithProviders } from '../test/renderWithProviders';

describe('ErrorState', () => {
  test('shows the message and retries', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <ErrorState message='API caída' onRetry={onRetry} />
    );

    expect(screen.getByText('API caída')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  test('can use the default location', async () => {
    const onUseDefault = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <ErrorState
        message='Error'
        onRetry={vi.fn()}
        onUseDefault={onUseDefault}
      />
    );

    await user.click(
      screen.getByRole('button', { name: 'Usar ubicación por defecto' })
    );
    expect(onUseDefault).toHaveBeenCalledTimes(1);
  });
});

describe('FavoritesBar', () => {
  test('shows empty hint without favorites', () => {
    renderWithProviders(
      <FavoritesBar favorites={[]} onSelect={vi.fn()} onRemove={vi.fn()} />
    );
    expect(screen.getByText(/Marca una ciudad con la estrella/)).toBeInTheDocument();
  });

  test('selects and removes favorite cities', async () => {
    const onSelect = vi.fn();
    const onRemove = vi.fn();
    const user = userEvent.setup();
    const city = {
      key: '40.42,-3.70',
      name: 'Madrid',
      country: 'ES',
      lat: 40.4168,
      lon: -3.7038,
    };
    renderWithProviders(
      <FavoritesBar favorites={[city]} onSelect={onSelect} onRemove={onRemove} />
    );

    await user.click(screen.getByRole('button', { name: 'Madrid', exact: true }));
    expect(onSelect).toHaveBeenCalledWith(city);

    await user.click(
      screen.getByRole('button', { name: 'Quitar Madrid de favoritos' })
    );
    expect(onRemove).toHaveBeenCalledWith('40.42,-3.70');
  });
});
