import Link from "next/link"

const features = [
  {
    title: "Real-Time Financial Tracking",
    description:
      "Track credits, debits, campaign spending, salaries, payouts, subscriptions, marketing costs, and operational fund movement in real time.",
  },
  {
    title: "Campaign Finance Intelligence",
    description:
      "Separate client-linked campaign money from company-owned operational capital with complete clarity.",
  },
  {
    title: "Live Currency Conversion",
    description:
      "Switch instantly between INR and USD using live exchange-rate integration across the platform.",
  },
  {
    title: "Executive Reports & Projections",
    description:
      "Generate snapshots, runway projections, profit-loss analysis, and operational financial insights.",
  },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#04010d] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#8b5cf620,transparent_30%),radial-gradient(circle_at_bottom_left,#06b6d420,transparent_30%)] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <img
            src="/icon.png"
            alt="Clipency"
            className="h-12 w-12 rounded-2xl border border-white/10"
          />

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Clipency
            </h1>

            <p className="text-cyan-300 text-sm tracking-[0.3em]">
              FINANCE OS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://clipency.in"
            target="_blank"
            className="hidden md:flex px-5 py-2 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all duration-300"
          >
            Visit Clipency.in
          </a>

          <Link
            href="/login"
            className="px-5 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:scale-105 transition-all duration-300 font-semibold"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-12 pt-24 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-cyan-300 text-sm mb-6">
              Internal Financial Intelligence System
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              Financial
              <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
                {" "}Command Centre
              </span>
            </h1>

            <p className="mt-8 text-lg text-white/70 leading-relaxed max-w-2xl">
              Clipency Finance OS is a centralized internal finance platform
              built to track operational capital, campaign spending, payouts,
              salaries, subscriptions, marketing expenses, and financial flow
              across the company.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 font-semibold hover:scale-105 transition-all duration-300"
              >
                Access Finance OS
              </Link>

              <a
                href="https://clipency.in"
                target="_blank"
                className="px-7 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                Explore Clipency.in
              </a>
            </div>
          </div>

          {/* Right Side Card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-[32px] blur-xl opacity-20" />

            <div className="relative rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                  <p className="text-white/60 text-sm">Dynamic Fund</p>
                  <h3 className="text-4xl font-bold text-cyan-300 mt-3">
                    Live
                  </h3>
                </div>

                <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                  <p className="text-white/60 text-sm">Currency Engine</p>
                  <h3 className="text-4xl font-bold text-fuchsia-300 mt-3">
                    API
                  </h3>
                </div>

                <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                  <p className="text-white/60 text-sm">Campaign Tracking</p>
                  <h3 className="text-3xl font-bold text-emerald-300 mt-3">
                    Real-Time
                  </h3>
                </div>

                <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                  <p className="text-white/60 text-sm">Security Layer</p>
                  <h3 className="text-3xl font-bold text-yellow-300 mt-3">
                    Protected
                  </h3>
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-fuchsia-500/20 bg-fuchsia-500/10 p-6">
                <p className="text-fuchsia-300 text-sm tracking-[0.3em] uppercase">
                  Finance Discipline
                </p>

                <h3 className="mt-4 text-2xl font-bold">
                  Dynamic Fund is not company-owned money.
                </h3>

                <p className="mt-4 text-white/60 leading-relaxed">
                  Campaign funds and operational funds remain separated for
                  complete financial clarity and accountability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <h2 className="text-4xl font-bold">
              Built for modern operational finance
            </h2>

            <p className="mt-4 text-white/60 text-lg">
              A secure internal finance infrastructure designed for real-time
              visibility and operational control.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl hover:border-cyan-400/30 hover:-translate-y-2 transition-all duration-500"
              >
                <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-300 transition">
                  {feature.title}
                </h3>

                <p className="text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
