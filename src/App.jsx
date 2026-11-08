import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import CurrentWeather from './components/CurrentWeather';
import WeatherDetails from './components/WeatherDetails';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import FavoritesBar from './components/FavoritesBar';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import Notice from './components/Notice';
import { DEFAULT_CITY, DEFAULT_LOCATION } from './config';
import {
  clearWeatherError,
  loadWeatherByCity,
  loadWeatherByCoords,
  refreshWeather,
  selectCurrentWeather,
  selectForecast,
  selectLastUpdated,
  selectLocation,
  selectWeatherError,
  selectWeatherStatus,
} from './features/weather/weatherSlice';
import {
  selectTheme,
  selectUnits,
  setUnits,
  toggleTheme,
} from './features/settings/settingsSlice';
import {
  removeFavorite,
  selectFavorites,
  toggleFavorite,
} from './features/favorites/favoritesSlice';
import { getGeolocationErrorMessage } from './utils/errors';
import { getWeatherTheme, roundTemperature } from './utils/weather';

const App = () => {
  const dispatch = useDispatch();
  const units = useSelector(selectUnits);
  const theme = useSelector(selectTheme);
  const current = useSelector(selectCurrentWeather);
  const forecast = useSelector(selectForecast);
  const location = useSelector(selectLocation);
  const status = useSelector(selectWeatherStatus);
  const error = useSelector(selectWeatherError);
  const lastUpdated = useSelector(selectLastUpdated);
  const favorites = useSelector(selectFavorites);

  const [notice, setNotice] = useState(null);
  const [locating, setLocating] = useState(false);
  const didInit = useRef(false);
  const unitsRef = useRef(units);
  const locationRef = useRef(location);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#0f172a' : '#0369a1');
    }
  }, [theme]);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    if (location) {
      dispatch(loadWeatherByCoords(location));
    } else if (DEFAULT_CITY) {
      dispatch(loadWeatherByCity(DEFAULT_CITY));
    } else {
      dispatch(loadWeatherByCoords(DEFAULT_LOCATION));
    }
  }, [dispatch, location]);

  useEffect(() => {
    if (unitsRef.current === units) return;
    unitsRef.current = units;
    if (locationRef.current) {
      dispatch(loadWeatherByCoords(locationRef.current));
    }
  }, [units, dispatch]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!current) {
      document.title = 'Meteo — El tiempo, bien contado';
      return;
    }
    const temperature = roundTemperature(current.main?.temp);
    document.title = `${temperature}° · ${current.name} — Meteo`;
  }, [current]);

  const notify = (message, type = 'success') => {
    setNotice({ message, type, id: Date.now() });
  };

  const isFavorite = Boolean(
    location?.key && favorites.some((city) => city.key === location.key)
  );

  const handleSearch = (query) => {
    dispatch(loadWeatherByCity(query));
  };

  const handleSelectCity = (city) => {
    dispatch(
      loadWeatherByCoords({
        lat: city.lat,
        lon: city.lon,
        name: city.name,
        country: city.country,
        state: city.state,
      })
    );
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      notify('Tu navegador no permite obtener la ubicación.', 'error');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        dispatch(
          loadWeatherByCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        );
        notify('Mostrando el tiempo de tu ubicación.');
      },
      (geoError) => {
        setLocating(false);
        notify(getGeolocationErrorMessage(geoError), 'error');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  const handleToggleFavorite = () => {
    if (!location) return;
    dispatch(toggleFavorite(location));
    notify(
      isFavorite
        ? `${location.name} eliminada de favoritos`
        : `${location.name} guardada en favoritos`
    );
  };

  const handleRemoveFavorite = (key) => {
    dispatch(removeFavorite(key));
    notify('Ciudad eliminada de favoritos');
  };

  const handleSelectFavorite = (city) => {
    dispatch(loadWeatherByCoords(city));
  };

  const handleRetry = () => {
    if (location) dispatch(refreshWeather());
    else dispatch(loadWeatherByCoords(DEFAULT_LOCATION));
  };

  const handleUseDefault = () => {
    dispatch(loadWeatherByCoords(DEFAULT_LOCATION));
  };

  const weatherTheme = getWeatherTheme(current);
  const isLoading = status === 'loading';
  const showInitialLoading = isLoading && !current;
  const showInitialError = status === 'failed' && !current;

  return (
    <div className={`weather-bg weather-${weatherTheme} flex min-h-screen flex-col text-white`}>
      <Header
        units={units}
        theme={theme}
        onUnitsChange={(value) => dispatch(setUnits(value))}
        onThemeToggle={() => dispatch(toggleTheme())}
        onSearch={handleSearch}
        onSelectCity={handleSelectCity}
        onUseLocation={handleUseLocation}
        locating={locating}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-3">
          <FavoritesBar
            favorites={favorites}
            onSelect={handleSelectFavorite}
            onRemove={handleRemoveFavorite}
          />
          {notice && <Notice notice={notice} onClose={() => setNotice(null)} />}
          {error && current && (
            <Notice
              notice={{ message: error, type: 'error' }}
              onClose={() => dispatch(clearWeatherError())}
            />
          )}
        </div>

        {showInitialLoading && <LoadingState />}

        {showInitialError && (
          <ErrorState
            message={error}
            onRetry={handleRetry}
            onUseDefault={handleUseDefault}
            retrying={isLoading}
          />
        )}

        {current && (
          <div className="grid gap-4">
            <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
              <CurrentWeather
                current={current}
                location={location}
                units={units}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                onRefresh={handleRetry}
                lastUpdated={lastUpdated}
                refreshing={isLoading}
              />
              <WeatherDetails current={current} units={units} />
            </div>

            <HourlyForecast forecast={forecast} units={units} />
            <DailyForecast forecast={forecast} units={units} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
