import { WiRaindrop } from 'react-icons/wi';
import {
  formatTemperature,
  getDailyForecast,
  getWeatherIcon,
} from '../utils/weather';

const DailyForecast = ({ forecast, units }) => {
  const days = getDailyForecast(forecast);

  return (
    <section className="glass rounded-[2rem] p-4 sm:p-5" aria-labelledby="daily-title">
      <div className="mb-3 flex items-end justify-between gap-3 px-1">
        <div>
          <h2 id="daily-title" className="text-lg font-bold tracking-tight">
            Próximos días
          </h2>
          <p className="text-sm text-white/55">Máximas, mínimas y probabilidad de lluvia</p>
        </div>
      </div>

      {days.length === 0 ? (
        <p className="px-1 py-6 text-sm text-white/60">
          No hay datos diarios disponibles.
        </p>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {days.map((day, index) => (
            <div
              key={day.dateKey}
              className={`rounded-2xl border p-4 text-center transition ${
                index === 0
                  ? 'border-white/30 bg-white/15'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <p className="text-sm font-bold text-white/90">{day.label}</p>
              <img
                src={getWeatherIcon(day.icon)}
                alt={day.description || 'Tiempo'}
                className="mx-auto my-2 size-14 object-contain"
              />
              <p className="line-clamp-1 text-xs text-white/55 first-letter:uppercase">
                {day.description}
              </p>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm">
                <span className="font-extrabold">
                  {formatTemperature(day.max, units, false)}°
                </span>
                <span className="text-white/55">
                  {formatTemperature(day.min, units, false)}°
                </span>
              </div>
              <p className="mt-1 flex items-center justify-center gap-0.5 text-[11px] text-sky-200/75">
                <WiRaindrop aria-hidden="true" />
                {Math.round((day.pop ?? 0) * 100)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default DailyForecast;
