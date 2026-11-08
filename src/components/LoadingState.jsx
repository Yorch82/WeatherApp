const SkeletonBlock = ({ className = '' }) => (
  <div className={`animate-pulse rounded-[2rem] border border-white/10 bg-white/5 ${className}`} />
);

const LoadingState = () => (
  <div
    role="status"
    aria-label="Cargando el tiempo"
    className="grid gap-4 lg:grid-cols-[1.6fr_1fr]"
  >
    <SkeletonBlock className="min-h-[420px]" />
    <SkeletonBlock className="min-h-[420px]" />
    <SkeletonBlock className="h-40 lg:col-span-2" />
    <SkeletonBlock className="h-52 lg:col-span-2" />
  </div>
);

export default LoadingState;
