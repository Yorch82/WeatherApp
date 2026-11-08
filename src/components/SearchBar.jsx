import { useEffect, useRef, useState } from 'react';
import { FiLoader, FiMapPin, FiSearch, FiX } from 'react-icons/fi';
import weatherService from '../services/weatherService';
import { getWeatherErrorMessage } from '../utils/errors';

const SearchBar = ({ onSearch, onSelectCity }) => {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const requestId = useRef(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setCities([]);
      setError('');
      setLoading(false);
      setOpen(false);
      return undefined;
    }

    const id = ++requestId.current;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const results = await weatherService.searchCities(trimmed);
        if (id !== requestId.current) return;
        setCities(results);
        setOpen(true);
        setActiveIndex(-1);
        if (results.length === 0) {
          setError('No hemos encontrado ciudades con ese nombre.');
        }
      } catch (requestError) {
        if (id !== requestId.current) return;
        setCities([]);
        setOpen(true);
        setError(getWeatherErrorMessage(requestError));
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const chooseCity = (city) => {
    setQuery(city.name);
    setOpen(false);
    setCities([]);
    setError('');
    onSelectCity(city);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    if (activeIndex >= 0 && cities[activeIndex]) {
      chooseCity(cities[activeIndex]);
      return;
    }
    setOpen(false);
    onSearch(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, cities.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const hasResults = cities.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className="glass flex items-center gap-3 rounded-2xl px-4 py-2.5 transition focus-within:ring-2 focus-within:ring-white/40"
        role="search"
      >
        <FiSearch className="shrink-0 text-white/70" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (hasResults || error) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Busca una ciudad…"
          aria-label="Buscar ciudad"
          role="combobox"
          aria-expanded={open}
          aria-controls="city-suggestions"
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `city-option-${activeIndex}` : undefined
          }
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white placeholder:text-white/55 focus:outline-none sm:text-base"
        />
        {loading && (
          <FiLoader className="animate-spin text-white/70" aria-label="Buscando" />
        )}
        {!loading && query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setOpen(false);
            }}
            aria-label="Limpiar búsqueda"
            className="rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <FiX aria-hidden="true" />
          </button>
        )}
      </form>

      {open && (
        <ul
          id="city-suggestions"
          role="listbox"
          aria-label="Ciudades sugeridas"
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/15 bg-slate-950/90 p-1.5 shadow-2xl backdrop-blur-xl"
        >
          {hasResults &&
            cities.map((city, index) => (
              <li key={`${city.id}-${city.lat}-${city.lon}`} role="none">
                <button
                  type="button"
                  id={`city-option-${index}`}
                  role="option"
                  aria-selected={activeIndex === index}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => chooseCity(city)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                    activeIndex === index
                      ? 'bg-white/15'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <FiMapPin className="shrink-0 text-white/60" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-white">
                      {city.name}
                    </span>
                    <span className="block truncate text-xs text-white/55">
                      {[city.state, city.country].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          {!hasResults && error && (
            <li className="px-3 py-3 text-sm text-white/70" role="none">
              {error}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
