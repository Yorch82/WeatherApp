import { FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi';

const Notice = ({ notice, onClose }) => {
  if (!notice) return null;
  const isError = notice.type === 'error';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`glass flex items-start gap-3 rounded-2xl px-4 py-3 text-sm shadow-xl ${
        isError ? 'text-rose-100' : 'text-emerald-50'
      }`}
    >
      <span className={`mt-0.5 text-lg ${isError ? 'text-rose-300' : 'text-emerald-300'}`}>
        {isError ? <FiAlertCircle aria-hidden="true" /> : <FiCheckCircle aria-hidden="true" />}
      </span>
      <p className="flex-1 leading-snug">{notice.message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar aviso"
        className="rounded-full p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
      >
        <FiX aria-hidden="true" />
      </button>
    </div>
  );
};

export default Notice;
