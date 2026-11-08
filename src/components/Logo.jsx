import { WiDaySunny } from 'react-icons/wi';

const Logo = () => {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <span className="grid size-10 place-items-center rounded-2xl bg-white/15 text-2xl text-amber-200 ring-1 ring-white/20">
        <WiDaySunny aria-hidden="true" />
      </span>
      <div className="leading-none">
        <p className="text-lg font-extrabold tracking-tight">Meteo</p>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
          El tiempo, bien contado
        </p>
      </div>
    </div>
  );
};

export default Logo;
