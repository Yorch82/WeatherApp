import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'test-api-key');
vi.stubEnv('VITE_WEATHER_API_BASE', 'https://weather.test/data/2.5');
vi.stubEnv('VITE_GEO_API_BASE', 'https://geo.test/geo/1.0');

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.clearAllMocks();
});

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}

window.scrollTo = vi.fn();

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = global.ResizeObserver || ResizeObserverMock;
