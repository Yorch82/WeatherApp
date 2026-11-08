const UnitToggle = ({ units, onChange }) => {
  return (
    <div
      className="glass inline-flex items-center rounded-2xl p-1"
      role="group"
      aria-label="Unidades de temperatura"
    >
      {[
        { value: 'metric', label: '°C', title: 'Celsius' },
        { value: 'imperial', label: '°F', title: 'Fahrenheit' },
      ].map((unit) => (
        <button
          key={unit.value}
          type="button"
          title={unit.title}
          aria-pressed={units === unit.value}
          onClick={() => onChange(unit.value)}
          className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition sm:px-3 sm:text-sm ${
            units === unit.value
              ? 'bg-white text-slate-900 shadow'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          {unit.label}
        </button>
      ))}
    </div>
  );
};

export default UnitToggle;
