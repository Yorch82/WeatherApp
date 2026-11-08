import { FaRegStar, FaStar } from 'react-icons/fa';
import { FiMapPin, FiRefreshCw } from 'react-icons/fi';
import {
  formatDateFromOffset,
  formatHourFromOffset,
  formatTemperature,
  getWeatherDescription,
  getWeatherIcon,
} from '../utils/weather';

const CurrentWeather = ({
  current,
  location,
  units,
  isFavorite,
  onToggleFavorite,
  onRefresh,
  lastUpdated,
  refreshing,
}) => {
  if (!current) return null;

  const offset = current.timezone ?? 0;
  const description = getWeatherDescription(current);
  const updated = lastUpdated
    ? new Intl.DateTimeFormat('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(lastUpdated))
    : null;

  return (
    <section className="glass relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[2rem] p-6 sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-20 size-72 rounded-full bg-sky-300/15 blur-3xl"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-white/85 sm:text-base">
            <FiMapPin aria-hidden="true" />
            <span>
              {location?.name || current.name}
              {location?.country ? `, ${location.country}` : ''}
            </span>
          </p>
          <p className="mt-1 text-xs font-medium text-white/55 first-letter:uppercase sm:text-sm">
            {formatDateFromOffset(current.dt, offset, {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
            {' · '}
            {formatHourFromOffset(current.dt, offset)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite ? 'Quitar de ciudades favoritas' : 'Guardar en favoritos'
            }
            title={isFavorite ? 'Quitar de favoritos' : 'Guardar ciudad'}
            className="grid size-10 place-items-center rounded-2xl bg-white/10 text-lg text-amber-200 ring-1 ring-white/15 transition hover:bg-white/20"
          >
            {isFavorite ? <FaStar aria-hidden="true" /> : <FaRegStar aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Actualizar el tiempo"
            title="Actualizar"
            className="grid size-10 place-items-center rounded-2xl bg-white/10 text-white/75 ring-1 ring-white/15 transition hover:bg-white/20 hover:text-white"
          >
            <FiRefreshCw
              aria-hidden="true"
              className={refreshing ? 'animate-spin' : undefined}
            />
          </button>
        </div>
      </div>

      <div className="relative mt-6 flex flex-wrap items-center gap-4 sm:gap-8">
        <img
          src={getWeatherIcon(current.weather?.[0]?.icon)}
          alt={description}
          className="weather-icon size-32 object-contain drop-shadow-2xl sm:size-40"
        />
        <div>
          <p className="text-7xl font-extrabold leading-none tracking-[-0.06em] sm:text-8xl">
            {formatTemperature(current.main?.temp, units, false)}
            <span className="align-top text-3xl font-semibold text-white/70 sm:text-4xl">
              {units === 'metric' ? '°C' : '°F'}
            </span>
          </p>
          <p className="mt-2 text-lg font-semibold text-white/90 first-letter:uppercase sm:text-xl">
            {description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/65">
            <span>
              Máx. {formatTemperature(current.main?.temp_max, units)}
            </span>
            <span>
              Mín. {formatTemperature(current.main?.temp_min, units)}
            </span>
            <span>
              Sensación {formatTemperature(current.main?.feels_like, units)}
            </span>
          </div>
        </div>
      </div>

      <div className="relative mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-white/50">
        <span>Datos de OpenWeather</span>
        {updated && <span>Actualizado a las {updated}</span>}
      </div>
    </section>
  );
};

export default CurrentWeather;
