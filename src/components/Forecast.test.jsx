import { describe, expect, test } from 'vitest';
import { screen } from '@testing-library/react';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import WeatherDetails from './WeatherDetails';
import { renderWithProviders } from '../test/renderWithProviders';
import { currentWeather, forecast } from '../test/fixtures';

describe('HourlyForecast', () => {
  test('renders hourly cards with precipitation', () => {
    renderWithProviders(<HourlyForecast forecast={forecast} units='metric' />);
    expect(screen.getByText('Próximas horas')).toBeInTheDocument();
    expect(screen.getAllByText(/^\d{2}:\d{2}$/).length).toBe(10);
    expect(screen.getAllByText(/20°C/).length).toBeGreaterThan(0);
  });

  test('handles missing hourly data', () => {
    renderWithProviders(<HourlyForecast forecast={null} units='metric' />);
    expect(
      screen.getByText('No hay datos horarios disponibles.')
    ).toBeInTheDocument();
  });
});

describe('DailyForecast', () => {
  test('renders grouped daily cards', () => {
    renderWithProviders(<DailyForecast forecast={forecast} units='metric' />);
    expect(screen.getByText('Próximos días')).toBeInTheDocument();
    expect(screen.getByText('Hoy')).toBeInTheDocument();
    expect(screen.getByText('Mañana')).toBeInTheDocument();
    expect(screen.getAllByText(/\d+°/).length).toBeGreaterThan(4);
  });

  test('handles missing daily data', () => {
    renderWithProviders(<DailyForecast forecast={null} units='metric' />);
    expect(screen.getByText('No hay datos diarios disponibles.')).toBeInTheDocument();
  });
});

describe('WeatherDetails', () => {
  test('renders meteorological details', () => {
    renderWithProviders(
      <WeatherDetails current={currentWeather} units='metric' />
    );
    expect(screen.getByText('Humedad')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('Viento')).toBeInTheDocument();
    expect(screen.getByText('13 km/h')).toBeInTheDocument();
    expect(screen.getByText('1015 hPa')).toBeInTheDocument();
    expect(screen.getByText('10 km')).toBeInTheDocument();
    expect(screen.getByText('Amanecer')).toBeInTheDocument();
    expect(screen.getByText('Atardecer')).toBeInTheDocument();
  });

  test('supports imperial units', () => {
    renderWithProviders(
      <WeatherDetails current={currentWeather} units='imperial' />
    );
    expect(screen.getByText('4 mph')).toBeInTheDocument();
    expect(screen.getByText('6.2 mi')).toBeInTheDocument();
  });
});
