import { WiRaindrop } from 'react-icons/wi';
import {
  formatHourFromOffset,
  formatTemperature,
  getHourlyForecast,
  getWeatherIcon,
} from '../utils/weather';

const HourlyForecast = ({ forecast, units }) => {
  const hours = getHourlyForecast(forecast, 10);
  const offset = forecast?.city?.timezone ?? 0;

  return (
    <section className="glass rounded-[2rem] p-4 sm:p-5" aria-labelledby="hourly-title">
      <div className="mb-3 flex items-end justify-between gap-3 px-1">
        <div>
          <h2 id="hourly-title" className="text-lg font-bold tracking-tight">
            Próximas horas
          </h2>
          <p className="text-sm text-white/55">Previsión cada 3 horas</p>
        </div>
      </div>

      {hours.length === 0 ? (
        <p className="px-1 py-6 text-sm text-white/60">
          No hay datos horarios disponibles.
        </p>
      ) : (
        <div className="hide-scrollbar flex gap-2.5 overflow-x-auto pb-2">
          {hours.map((hour, index) => (
            <div
              key={hour.dt}
              className={`min-w-[94px] rounded-2xl border p-3 text-center transition ${
                index === 0
                  ? 'border-white/30 bg-white/15'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <p className="text-xs font-semibold text-white/65">
                {formatHourFromOffset(hour.dt, offset)}
              </p>
              <img
                src={getWeatherIcon(hour.weather?.[0]?.icon)}
                alt={hour.weather?.[0]?.description ?? 'Tiempo'}
                className="mx-auto my-2 size-12 object-contain"
              />
              <p className="text-base font-bold">
                {formatTemperature(hour.main?.temp, units)}
              </p>
              <p className="mt-1 flex items-center justify-center gap-0.5 text-[11px] text-sky-200/80">
                <WiRaindrop aria-hidden="true" />
                {Math.round((hour.pop ?? 0) * 100)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default HourlyForecast;
