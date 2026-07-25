export default function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-2xl border bg-card p-8">
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="h-32 w-32 rounded-full bg-muted" />

          <div className="flex-1 space-y-3">
            <div className="h-7 w-48 rounded bg-muted" />
            <div className="h-4 w-64 rounded bg-muted" />
            <div className="h-4 w-40 rounded bg-muted" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-8">
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-8 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}