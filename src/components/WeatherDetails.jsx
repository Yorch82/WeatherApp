import { FaLocationArrow } from 'react-icons/fa';
import {
  WiBarometer,
  WiCloudy,
  WiHumidity,
  WiStrongWind,
  WiSunrise,
  WiSunset,
} from 'react-icons/wi';
import { FiEye, FiThermometer } from 'react-icons/fi';
import {
  formatPercent,
  formatPressure,
  formatVisibility,
  formatWind,
  getSunTimes,
  getWindDirection,
} from '../utils/weather';

const DetailTile = ({ icon, label, value, hint }) => (
  <div className="rounded-2xl border border-white/10 bg-white/10 p-3.5">
    <div className="flex items-center gap-2 text-white/55">
      <span className="text-xl" aria-hidden="true">
        {icon}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">
        {label}
      </span>
    </div>
    <p className="mt-2 text-lg font-bold text-white">{value}</p>
    {hint && <p className="mt-0.5 text-xs text-white/50">{hint}</p>}
  </div>
);

const WeatherDetails = ({ current, units }) => {
  if (!current) return null;

  const sun = getSunTimes(current);
  const windDirection = getWindDirection(current.wind?.deg);

  return (
    <section className="glass rounded-[2rem] p-4 sm:p-5" aria-label="Detalles del tiempo">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-white/55">
          Detalles
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <DetailTile
          icon={<FiThermometer />}
          label="Sensación"
          value={`${Math.round(current.main?.feels_like ?? 0)}${
            units === 'metric' ? '°C' : '°F'
          }`}
        />
        <DetailTile
          icon={<WiHumidity />}
          label="Humedad"
          value={formatPercent(current.main?.humidity)}
        />
        <DetailTile
          icon={<WiStrongWind />}
          label="Viento"
          value={formatWind(current.wind?.speed, units)}
          hint={
            <span className="inline-flex items-center gap-1">
              <FaLocationArrow
                aria-hidden="true"
                style={{ transform: `rotate(${current.wind?.deg ?? 0}deg)` }}
              />
              {windDirection}
            </span>
          }
        />
        <DetailTile
          icon={<WiBarometer />}
          label="Presión"
          value={formatPressure(current.main?.pressure)}
        />
        <DetailTile
          icon={<FiEye />}
          label="Visibilidad"
          value={formatVisibility(current.visibility, units)}
        />
        <DetailTile
          icon={<WiCloudy />}
          label="Nubosidad"
          value={formatPercent(current.clouds?.all)}
        />
        <DetailTile
          icon={<WiSunrise />}
          label="Amanecer"
          value={sun.sunrise}
        />
        <DetailTile icon={<WiSunset />} label="Atardecer" value={sun.sunset} />
      </div>
    </section>
  );
};

export default WeatherDetails;
