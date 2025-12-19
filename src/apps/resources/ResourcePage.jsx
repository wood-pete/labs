import { Link, useParams } from "react-router-dom";
import MarkdownRenderer from "./MarkdownRenderer.jsx";
import { moduleLookup, modules } from "./modules.js";

export default function ResourcePage() {
  const { slug } = useParams();
  const moduleData = moduleLookup[slug];

  if (!moduleData) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#f5f5f5] px-4 text-center text-neutral-900">
        <p className="text-sm uppercase tracking-[0.2em] text-red-600">Not found</p>
        <h1 className="text-2xl font-semibold text-neutral-900">
          We could not find that module.
        </h1>
        <Link
          to="/resources"
          className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_4px_12px_rgba(0,0,0,0.16)] transition hover:border-red-600 hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Back to resources
        </Link>
      </div>
    );
  }

  const moduleIndex = modules.findIndex((entry) => entry.slug === slug);
  const moduleNumber = moduleIndex >= 0 ? moduleIndex + 1 : null;

  return (
    <div className="box-border flex h-full min-h-0 flex-col overflow-y-auto bg-[#f5f5f5] px-1 pb-3 pt-2 text-neutral-900 sm:px-3 sm:pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to="/resources"
          className="inline-flex h-9 items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_4px_14px_rgba(0,0,0,0.16)] transition hover:border-red-600 hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Resources home
        </Link>
        <Link
          to="/"
          className="inline-flex h-9 items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_4px_14px_rgba(0,0,0,0.16)] transition hover:border-red-600 hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Main hub
        </Link>
      </div>

      <div className="mt-4 space-y-5 rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.08)] sm:p-6">
        <div
          className={`relative overflow-hidden rounded-2xl border border-neutral-900/10 bg-gradient-to-br ${moduleData.accent} p-5 shadow-inner shadow-black/10`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.5),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.3),transparent_35%)] mix-blend-screen" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.26em] text-neutral-900">
                Module {moduleNumber ?? moduleData.order} / {modules.length}
              </p>
              <h1 className="text-3xl font-semibold text-neutral-900 drop-shadow-sm sm:text-4xl">
                {moduleData.title}
              </h1>
              <p className="max-w-3xl text-sm text-neutral-900 sm:text-base">
                {moduleData.summary}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow shadow-black/20">
              {moduleData.badge}
            </span>
          </div>
        </div>

        <MarkdownRenderer content={moduleData.content} />
      </div>
    </div>
  );
}
