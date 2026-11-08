import { FiX } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const FavoritesBar = ({ favorites, onSelect, onRemove }) => {
  return (
    <section aria-label="Ciudades favoritas" className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
        Favoritas
      </span>
      {favorites.length === 0 ? (
        <span className="text-sm text-white/50">
          Marca una ciudad con la estrella para tenerla siempre a mano.
        </span>
      ) : (
        favorites.map((city) => (
          <div
            key={city.key}
            className="glass flex items-center gap-1 rounded-full py-1 pl-3 pr-1 text-sm"
          >
            <button
              type="button"
              onClick={() => onSelect(city)}
              className="flex items-center gap-1.5 font-semibold text-white/85 transition hover:text-white"
            >
              <FaStar className="text-[11px] text-amber-200" aria-hidden="true" />
              {city.name}
            </button>
            <button
              type="button"
              onClick={() => onRemove(city.key)}
              aria-label={`Quitar ${city.name} de favoritos`}
              className="grid size-6 place-items-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-white"
            >
              <FiX aria-hidden="true" />
            </button>
          </div>
        ))
      )}
    </section>
  );
};

export default FavoritesBar;
