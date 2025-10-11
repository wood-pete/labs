import { Link } from "react-router-dom";

export default function SevenVsApp() {
  return (
    <div className="flex min-h-[70vh] flex-col gap-10 bg-gradient-to-br from-black/70 via-red-950/70 to-orange-900/70 p-8">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/"
          className="inline-flex h-8 items-center justify-center rounded-full border border-orange-400/70 bg-black/70 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-orange-200 shadow shadow-black/40 transition hover:border-orange-300 hover:text-orange-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:h-9 sm:px-4 sm:text-xs"
        >
          Home
        </Link>
        <h2 className="text-3xl font-semibold text-orange-200 sm:text-4xl">
          SevenVs Coming Soon
        </h2>
      </div>

      <p className="max-w-xl text-base text-stone-200 sm:text-lg">
        This arena will pit seven contenders against each other with animated
        scoreboards, rapid-fire stats, and a blazing red-orange atmosphere. The
        experience is under construction—stay tuned for the first face-off.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link
          to="/matchup"
          className="rounded-full border border-orange-400/80 bg-black/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-200 shadow hover:border-orange-300 hover:text-orange-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Play Match-Up
        </Link>
        <Link
          to="/"
          className="rounded-full border border-red-700/70 bg-black/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-stone-100 shadow hover:border-orange-400 hover:text-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Back to Hub
        </Link>
      </div>

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-orange-300/80">
        <span className="h-px w-8 bg-orange-400/50" />
        Build In Progress
        <span className="h-px w-8 bg-orange-400/50" />
      </div>
    </div>
  );
}
