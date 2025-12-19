import { Link } from "react-router-dom";

const apps = [
  {
    name: "Cloud Platform Match-Up",
    description: "Drag-and-drop trivia that tests your memory of hyperscale features.",
    to: "/matchup",
    accent: "from-neutral-900/70 via-neutral-700/60 to-red-600/60",
  },
  {
    name: "SevenVs",
    description: "Futuristic versus simulator coming soon with real-time comparisons.",
    to: "/sevenvs",
    accent: "from-neutral-900/70 via-neutral-800/60 to-red-700/60",
  },
];

export default function Home() {
  return (
    <div className="relative isolate bg-white">
      <section className="flex flex-col gap-12 p-6 sm:p-10 lg:p-16">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">
            Academy Labs Hub
          </h2>
          <p className="text-base text-neutral-600 sm:text-lg">
            This hub keeps every experiment within reach. Browse the gallery,
            tap into the micro apps, and feel the precision of a black-and-white grid
            with bold red pacing lines.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {apps.map((app) => (
            <Link
              key={app.to}
              to={app.to}
              className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <div
                className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${app.accent} opacity-20 transition duration-300 group-hover:opacity-40`}
              />
              <div className="flex h-full flex-col justify-between gap-4">
                <div className="space-y-2">
                  <span className="inline-flex items-center rounded-full border border-neutral-900/80 bg-neutral-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                    Launch Pad
                  </span>
                  <h3 className="text-2xl font-semibold text-neutral-900 drop-shadow-sm">
                    {app.name}
                  </h3>
                  <p className="text-sm text-neutral-600">{app.description}</p>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold text-red-600">
                  Enter experience
                  <span className="translate-x-0 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
