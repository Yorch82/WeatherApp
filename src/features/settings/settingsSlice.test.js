import { describe, expect, test } from 'vitest';
import settingsReducer, {
  selectTheme,
  selectUnits,
  setTheme,
  setUnits,
  toggleTheme,
  toggleUnits,
} from './settingsSlice';

const initial = { units: 'metric', theme: 'dark' };

describe('settings slice', () => {
  test('sets and toggles units', () => {
    let state = settingsReducer(initial, setUnits('imperial'));
    expect(state.units).toBe('imperial');
    state = settingsReducer(state, toggleUnits());
    expect(state.units).toBe('metric');
  });

  test('ignores invalid units', () => {
    const state = settingsReducer(initial, setUnits('kelvin'));
    expect(state.units).toBe('metric');
  });

  test('sets and toggles theme', () => {
    let state = settingsReducer(initial, setTheme('light'));
    expect(state.theme).toBe('light');
    state = settingsReducer(state, toggleTheme());
    expect(state.theme).toBe('dark');
  });

  test('selectors', () => {
    const root = { settings: { units: 'imperial', theme: 'light' } };
    expect(selectUnits(root)).toBe('imperial');
    expect(selectTheme(root)).toBe('light');
  });
});
