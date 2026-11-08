import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import { WiCloudy } from 'react-icons/wi';

const ErrorState = ({ message, onRetry, onUseDefault, retrying }) => {
  return (
    <section className="glass mx-auto max-w-xl rounded-[2rem] p-8 text-center">
      <div className="mx-auto grid size-20 place-items-center rounded-full bg-white/10 text-4xl text-sky-200 ring-1 ring-white/15">
        <WiCloudy aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-2xl font-extrabold tracking-tight">
        No pudimos cargar el tiempo
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/65">
        {message}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100 disabled:opacity-60"
        >
          <FiRefreshCw
            aria-hidden="true"
            className={retrying ? 'animate-spin' : undefined}
          />
          Reintentar
        </button>
        {onUseDefault && (
          <button
            type="button"
            onClick={onUseDefault}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <FiAlertTriangle aria-hidden="true" />
            Usar ubicación por defecto
          </button>
        )}
      </div>
    </section>
  );
};

export default ErrorState;
