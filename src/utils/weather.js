import { LOCALE, UNIT_META } from '../config';

const FALLBACK_ICON = '01d';

export const getUnitMeta = (units = 'metric') =>
  UNIT_META[units] ?? UNIT_META.metric;

export const roundTemperature = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number) : null;
};

export const getLocationKey = (lat, lon) => {
  const latNumber = Number(lat);
  const lonNumber = Number(lon);
  if (!Number.isFinite(latNumber) || !Number.isFinite(lonNumber)) return null;
  return `${latNumber.toFixed(2)},${lonNumber.toFixed(2)}`;
};

export const formatTemperature = (value, units = 'metric', withUnit = true) => {
  const rounded = roundTemperature(value);
  if (rounded === null) return '—';
  return withUnit ? `${rounded}${getUnitMeta(units).temperature}` : `${rounded}`;
};

export const getWeatherIcon = (icon) => {
  const safeIcon = typeof icon === 'string' && /^\d{2}[dn]$/.test(icon)
    ? icon
    : FALLBACK_ICON;
  return `/images/weather_icons/${safeIcon}.png`;
};

export const getWindDirection = (degrees) => {
  if (degrees === null || degrees === undefined || degrees === '') return '—';
  const value = Number(degrees);
  if (!Number.isFinite(value)) return '—';
  const directions = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSO',
    'SO',
    'OSO',
    'O',
    'ONO',
    'NO',
    'NNO',
  ];
  const index = Math.round(((value % 360) + 360) % 360 / 22.5) % 16;
  return directions[index];
};

export const formatWind = (speed, units = 'metric') => {
  if (speed === null || speed === undefined || speed === '') return '—';
  const value = Number(speed);
  if (!Number.isFinite(value)) return '—';
  const meta = getUnitMeta(units);
  return `${Math.round(value * meta.windFactor)} ${meta.wind}`;
};

export const formatVisibility = (meters, units = 'metric') => {
  if (meters === null || meters === undefined || meters === '') return '—';
  const value = Number(meters);
  if (!Number.isFinite(value)) return '—';
  const meta = getUnitMeta(units);
  const converted = value / meta.distanceFactor;
  if (converted < 1) return `${Math.round(value)} m`;
  return `${converted.toFixed(converted >= 10 ? 0 : 1)} ${meta.distance}`;
};

export const formatPressure = (hPa) => {
  if (hPa === null || hPa === undefined || hPa === '') return '—';
  const value = Number(hPa);
  return Number.isFinite(value) ? `${Math.round(value)} hPa` : '—';
};

export const formatPercent = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value);
  return Number.isFinite(number) ? `${Math.round(number)}%` : '—';
};

const shiftedDate = (timestampSeconds, offsetSeconds = 0) =>
  new Date((Number(timestampSeconds) + Number(offsetSeconds)) * 1000);

export const formatHourFromOffset = (timestamp, offset = 0) => {
  if (!Number.isFinite(Number(timestamp))) return '—';
  return new Intl.DateTimeFormat(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(shiftedDate(timestamp, offset));
};

export const formatDateFromOffset = (
  timestamp,
  offset = 0,
  options = { weekday: 'long', day: 'numeric', month: 'long' }
) => {
  if (!Number.isFinite(Number(timestamp))) return '—';
  return new Intl.DateTimeFormat(LOCALE, {
    ...options,
    timeZone: 'UTC',
  }).format(shiftedDate(timestamp, offset));
};

export const getLocalDateKey = (timestamp, offset = 0) =>
  shiftedDate(timestamp, offset).toISOString().slice(0, 10);

export const formatDayLabel = (dateKey, index = 0) => {
  if (index === 0) return 'Hoy';
  if (index === 1) return 'Mañana';
  const date = new Date(`${dateKey}T12:00:00.000Z`);
  const label = new Intl.DateTimeFormat(LOCALE, {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const formatUpdatedAt = (timestamp) => {
  if (!timestamp) return '';
  return new Intl.DateTimeFormat(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
};

export const getWeatherTheme = (weather) => {
  const condition = weather?.weather?.[0] ?? weather ?? {};
  const id = Number(condition.id);
  const icon = condition.icon || '01d';
  const suffix = icon.endsWith('n') ? 'night' : 'day';

  if (id >= 200 && id < 300) return 'storm';
  if (id >= 300 && id < 600) return 'rain';
  if (id >= 600 && id < 700) return 'snow';
  if (id >= 700 && id < 800) return 'mist';
  if (id === 800) return `clear-${suffix}`;
  if (id > 800) return `clouds-${suffix}`;
  return `clear-${suffix}`;
};

export const getWeatherDescription = (weather) => {
  const description = weather?.weather?.[0]?.description;
  return description
    ? description.charAt(0).toUpperCase() + description.slice(1)
    : 'Sin datos';
};

export const formatCity = (city, country) => {
  if (!city) return 'Ubicación desconocida';
  return country ? `${city}, ${country}` : city;
};

export const getHourlyForecast = (forecast, limit = 10) => {
  const list = Array.isArray(forecast?.list) ? forecast.list : [];
  return list.slice(0, limit);
};

export const getDailyForecast = (forecast) => {
  const list = Array.isArray(forecast?.list) ? forecast.list : [];
  const offset = forecast?.city?.timezone ?? 0;
  const todayKey = getLocalDateKey(Date.now() / 1000, offset);
  const groups = new Map();

  for (const item of list) {
    const key = getLocalDateKey(item.dt, offset);
    const existing = groups.get(key);
    const tempMin = Number(item.main?.temp_min);
    const tempMax = Number(item.main?.temp_max);

    if (!existing) {
      groups.set(key, {
        dateKey: key,
        min: tempMin,
        max: tempMax,
        icon: item.weather?.[0]?.icon || '01d',
        description: item.weather?.[0]?.description || '',
        pop: Number(item.pop) || 0,
      });
      continue;
    }

    existing.min = Math.min(existing.min, tempMin);
    existing.max = Math.max(existing.max, tempMax);
    existing.pop = Math.max(existing.pop, Number(item.pop) || 0);
  }

  const orderedKeys = [...groups.keys()].sort();
  const todayIndex = orderedKeys.indexOf(todayKey);

  return orderedKeys.map((key, index) => {
    const group = groups.get(key);
    const relativeIndex = todayIndex >= 0 ? index - todayIndex : index;
    return {
      ...group,
      label: formatDayLabel(key, relativeIndex),
    };
  });
};

export const getSunTimes = (current) => {
  const offset = current?.timezone ?? 0;
  return {
    sunrise: formatHourFromOffset(current?.sys?.sunrise, offset),
    sunset: formatHourFromOffset(current?.sys?.sunset, offset),
  };
};
