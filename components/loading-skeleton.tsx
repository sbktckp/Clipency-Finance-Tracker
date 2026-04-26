export function PageSkeleton({ title = "Loading Finance OS" }: { title?: string }) {
  return (
    <div className="min-h-screen bg-[#02030a] px-4 py-5 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mb-8">
          <div className="h-7 w-48 rounded-full bg-white/10" />
          <div className="mt-5 h-10 w-80 rounded-xl bg-white/10" />
          <div className="mt-3 h-5 w-full max-w-[520px] rounded-xl bg-white/5" />
          <p className="mt-4 text-sm text-slate-500">{title}</p>
        </div>

        <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <div className="h-4 w-28 rounded-full bg-white/10" />
              <div className="mt-6 h-9 w-36 rounded-xl bg-white/10" />
              <div className="mt-4 h-4 w-44 rounded-full bg-white/5" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="h-7 w-36 rounded-xl bg-white/10" />
            <div className="mt-3 h-4 w-56 rounded-full bg-white/5" />

            <div className="mt-8 space-y-5">
              {[1, 2, 3, 4].map((item) => (
                <div key={item}>
                  <div className="mb-2 h-4 w-24 rounded-full bg-white/10" />
                  <div className="h-12 rounded-xl bg-white/5" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="h-7 w-40 rounded-xl bg-white/10" />
            <div className="mt-3 h-4 w-64 rounded-full bg-white/5" />

            <div className="mt-8 space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="grid grid-cols-5 gap-4 rounded-2xl border border-white/5 bg-black/20 p-4"
                >
                  <div className="h-4 rounded-full bg-white/10" />
                  <div className="h-4 rounded-full bg-white/10" />
                  <div className="h-4 rounded-full bg-white/10" />
                  <div className="h-4 rounded-full bg-white/10" />
                  <div className="h-4 rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
