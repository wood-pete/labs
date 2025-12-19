import { Link, useParams } from "react-router-dom";
import MarkdownRenderer from "./MarkdownRenderer.jsx";
import { moduleLookup, modules } from "./modules.js";

export default function ResourcePage() {
  const { slug } = useParams();
  const moduleData = moduleLookup[slug];

  if (!moduleData) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-black px-4 text-center text-stone-100">
        <p className="text-sm uppercase tracking-[0.2em] text-orange-300/80">Not found</p>
        <h1 className="text-2xl font-semibold text-orange-100">
          We could not find that module.
        </h1>
        <Link
          to="/resources"
          className="rounded-full border border-orange-400/70 bg-black/70 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-100 shadow shadow-black/40 transition hover:border-orange-300 hover:text-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Back to resources
        </Link>
      </div>
    );
  }

  const moduleIndex = modules.findIndex((entry) => entry.slug === slug);
  const moduleNumber = moduleIndex >= 0 ? moduleIndex + 1 : null;

  return (
    <div className="box-border flex h-full min-h-0 flex-col overflow-y-auto bg-gradient-to-b from-black via-red-950/80 to-orange-950/60 px-1 pb-3 pt-2 text-stone-100 sm:px-3 sm:pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to="/resources"
          className="inline-flex h-9 items-center justify-center rounded-full border border-orange-400/70 bg-black/70 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-orange-100 shadow shadow-black/40 transition hover:border-orange-300 hover:text-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Resources home
        </Link>
        <Link
          to="/"
          className="inline-flex h-9 items-center justify-center rounded-full border border-orange-400/70 bg-black/70 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-orange-100 shadow shadow-black/40 transition hover:border-orange-300 hover:text-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Main hub
        </Link>
      </div>

      <div className="mt-4 space-y-5 rounded-3xl border border-red-800/60 bg-black/60 p-5 shadow-xl shadow-black/40 sm:p-6">
        <div
          className={`relative overflow-hidden rounded-2xl border border-red-800/70 bg-gradient-to-br ${moduleData.accent} p-5 shadow-inner shadow-black/40`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_35%)] mix-blend-screen" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.26em] text-orange-50/90">
                Module {moduleNumber ?? moduleData.order} / {modules.length}
              </p>
              <h1 className="text-3xl font-semibold text-white drop-shadow-sm sm:text-4xl">
                {moduleData.title}
              </h1>
              <p className="max-w-3xl text-sm text-orange-50/90 sm:text-base">
                {moduleData.summary}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-50/50 bg-black/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-100 shadow shadow-black/40">
              {moduleData.badge}
            </span>
          </div>
        </div>

        <MarkdownRenderer content={moduleData.content} />
      </div>
    </div>
  );
}
