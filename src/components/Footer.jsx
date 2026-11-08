const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/10 bg-slate-950/20">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          Datos meteorológicos de{' '}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-white/65 underline-offset-2 hover:text-white hover:underline"
          >
            OpenWeather
          </a>
          . Los horarios se muestran en la zona de la ciudad buscada.
        </p>
        <p>Hecho con React 19, Vite y Tailwind CSS.</p>
      </div>
    </footer>
  );
};

export default Footer;
