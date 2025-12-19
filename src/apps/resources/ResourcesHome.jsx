import { Link } from "react-router-dom";
import { modules } from "./modules.js";

export default function ResourcesHome() {
  return (
    <div className="box-border flex h-full min-h-0 flex-col overflow-y-auto bg-gradient-to-b from-black via-red-950/80 to-orange-950/60 px-1 pb-2 pt-2 text-stone-100 sm:px-3 sm:pt-4">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-red-800/70 bg-black/50 px-4 py-3 shadow-lg shadow-black/40">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.24em] text-orange-300/80">
            Resource Library
          </p>
          <h1 className="text-2xl font-semibold text-orange-100 sm:text-3xl">
            Training Modules
          </h1>
          <p className="text-sm text-stone-300">
            Browse every module, then jump into the rendered markdown pages with
            richer formatting.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex h-9 items-center justify-center rounded-full border border-orange-400/70 bg-black/70 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-orange-100 shadow shadow-black/40 transition hover:border-orange-300 hover:text-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Home
        </Link>
      </header>

      <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Link
            key={module.slug}
            to={`/resources/${module.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-red-800/70 bg-black/50 shadow-lg shadow-red-900/40 transition duration-300 hover:-translate-y-0.5 hover:border-orange-400/80 hover:shadow-red-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <div className="relative h-40 w-full overflow-hidden">
              <img
                src={module.image}
                alt={module.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${module.accent} opacity-70`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.14),transparent_35%)] mix-blend-screen" />
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-50 backdrop-blur">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-orange-200/60 bg-black/50 text-[11px] font-bold text-orange-100 shadow shadow-black/40">
                  {String(module.order).padStart(2, "0")}
                </span>
                <span>{module.badge}</span>
              </div>
            </div>
            <div className="space-y-2 px-4 py-3">
              <h3 className="text-lg font-semibold text-white drop-shadow-sm">
                {module.title}
              </h3>
              <p className="text-sm text-stone-300">
                {module.summary}
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-orange-200">
                Open module
                <span className="translate-x-0 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
