export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-slate-900/60 rounded-2xl h-32 md:h-40"></div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-900/60 rounded-2xl h-32"></div>
        ))}
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-slate-900/60 rounded-2xl h-96"></div>
        <div className="bg-slate-900/60 rounded-2xl h-96"></div>
      </div>

      {/* Bottom Section Skeleton */}
      <div className="bg-slate-900/60 rounded-2xl h-64"></div>
    </div>
  );
}
