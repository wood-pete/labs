import { Link } from "react-router-dom";
import { modules } from "./modules.js";

export default function ResourcesHome() {
  return (
    <div className="box-border flex h-full min-h-0 flex-col overflow-y-auto bg-[#f5f5f5] px-1 pb-2 pt-2 text-neutral-900 sm:px-3 sm:pt-4">
      <header className="relative flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-neutral-200 bg-white px-4 py-3 shadow-[0_10px_32px_rgba(0,0,0,0.06)]">
        <div className="absolute inset-x-3 -top-1 h-1 rounded-full bg-red-600" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-600">
            Resource Library
          </p>
          <h1 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
            Training Modules
          </h1>
          <p className="text-sm text-neutral-600">
            Browse every module, then jump into the rendered markdown pages with
            richer formatting.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex h-9 items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_4px_14px_rgba(0,0,0,0.16)] transition hover:border-red-600 hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Home
        </Link>
      </header>

      <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Link
            key={module.slug}
            to={`/resources/${module.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-red-600/80 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <div className="relative h-40 w-full overflow-hidden">
              <img
                src={module.image}
                alt={module.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${module.accent} opacity-25`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.14),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.12),transparent_35%)] mix-blend-screen" />
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-neutral-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-neutral-900 text-[11px] font-bold text-white shadow shadow-black/30">
                  {String(module.order).padStart(2, "0")}
                </span>
                <span>{module.badge}</span>
              </div>
            </div>
            <div className="space-y-2 px-4 py-3">
              <h3 className="text-lg font-semibold text-neutral-900 drop-shadow-sm">
                {module.title}
              </h3>
              <p className="text-sm text-neutral-600">
                {module.summary}
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-red-600">
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
