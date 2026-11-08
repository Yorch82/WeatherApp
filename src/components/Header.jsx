import { FiCrosshair } from 'react-icons/fi';
import Logo from './Logo';
import SearchBar from './SearchBar';
import UnitToggle from './UnitToggle';
import ThemeToggle from './ThemeToggle';

const Header = ({
  units,
  theme,
  onUnitsChange,
  onThemeToggle,
  onSearch,
  onSelectCity,
  onUseLocation,
  locating,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/25 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <div className="order-3 w-full md:order-none md:mx-4 md:w-auto md:flex-1 md:max-w-xl">
          <SearchBar onSearch={onSearch} onSelectCity={onSelectCity} />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onUseLocation}
            disabled={locating}
            title="Usar mi ubicación"
            aria-label="Usar mi ubicación"
            className="glass grid size-10 place-items-center rounded-2xl text-white/80 transition hover:bg-white/15 hover:text-white disabled:cursor-wait disabled:opacity-60"
          >
            <FiCrosshair
              aria-hidden="true"
              className={locating ? 'animate-spin' : undefined}
            />
          </button>
          <UnitToggle units={units} onChange={onUnitsChange} />
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
      </div>
    </header>
  );
};

export default Header;
