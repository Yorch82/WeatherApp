import { describe, expect, test } from 'vitest';
import favoritesReducer, {
  addFavorite,
  clearFavorites,
  removeFavorite,
  selectFavorites,
  selectIsFavorite,
  toggleFavorite,
} from './favoritesSlice';

const madrid = { name: 'Madrid', country: 'ES', lat: 40.4168, lon: -3.7038 };
const paris = { name: 'París', country: 'FR', lat: 48.8566, lon: 2.3522 };

describe('favorites slice', () => {
  test('adds cities without duplicates', () => {
    let state = favoritesReducer({ cities: [] }, addFavorite(madrid));
    expect(state.cities).toHaveLength(1);
    expect(state.cities[0].key).toBe('40.42,-3.70');
    state = favoritesReducer(state, addFavorite(madrid));
    expect(state.cities).toHaveLength(1);
  });

  test('toggles a city on and off', () => {
    let state = favoritesReducer({ cities: [] }, toggleFavorite(madrid));
    expect(state.cities).toHaveLength(1);
    state = favoritesReducer(state, toggleFavorite(paris));
    expect(state.cities).toHaveLength(2);
    state = favoritesReducer(state, toggleFavorite(madrid));
    expect(state.cities.map((city) => city.name)).toEqual(['París']);
  });

  test('removes by key and clears all', () => {
    let state = favoritesReducer({ cities: [] }, addFavorite(madrid));
    state = favoritesReducer(state, removeFavorite('40.42,-3.70'));
    expect(state.cities).toHaveLength(0);
    state = favoritesReducer(
      { cities: [{ ...madrid, key: '40.42,-3.70' }] },
      clearFavorites()
    );
    expect(state.cities).toHaveLength(0);
  });

  test('selectors', () => {
    const root = { favorites: { cities: [{ ...madrid, key: '40.42,-3.70' }] } };
    expect(selectFavorites(root)).toHaveLength(1);
    expect(selectIsFavorite(40.4168, -3.7038)(root)).toBe(true);
    expect(selectIsFavorite(48.8566, 2.3522)(root)).toBe(false);
  });
});
