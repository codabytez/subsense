export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-48 rounded-2xl bg-surface border border-border" />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-surface border border-border"
          />
        ))}
      </div>

      {/* Content rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-64 rounded-2xl bg-surface border border-border" />
        <div className="h-64 rounded-2xl bg-surface border border-border" />
      </div>
    </div>
  );
}
