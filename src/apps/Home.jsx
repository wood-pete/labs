import { Link } from "react-router-dom";

const apps = [
  {
    name: "Cloud Platform Match-Up",
    description: "Drag-and-drop trivia that tests your memory of hyperscale features.",
    to: "/matchup",
    accent: "from-red-600/90 via-red-500/80 to-orange-400/70",
  },
  {
    name: "SevenVs",
    description: "Futuristic versus simulator coming soon with real-time comparisons.",
    to: "/sevenvs",
    accent: "from-orange-500/80 via-red-500/70 to-red-700/80",
  },
];

export default function Home() {
  return (
    <div className="relative isolate">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,100,0,0.35),transparent_55%)]" />
      <section className="flex flex-col gap-12 p-6 sm:p-10 lg:p-16">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-semibold text-orange-200 sm:text-4xl">
            Ignite Your Next Micro App
          </h2>
          <p className="text-base text-stone-300 sm:text-lg">
            This hub keeps every experiment within reach. Browse the gallery,
            tap into the micro apps, and feel the red-orange energy across each
            experience.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {apps.map((app) => (
            <Link
              key={app.to}
              to={app.to}
              className="group relative overflow-hidden rounded-3xl border border-red-700/60 bg-black/60 p-6 shadow-lg shadow-red-900/40 transition duration-300 hover:border-orange-400 hover:shadow-red-600/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <div
                className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${app.accent} opacity-70 transition duration-300 group-hover:opacity-100`}
              />
              <div className="flex h-full flex-col justify-between gap-4">
                <div className="space-y-2">
                  <span className="inline-flex items-center rounded-full border border-orange-300/40 bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-200/90">
                    Launch
                  </span>
                  <h3 className="text-2xl font-semibold text-white drop-shadow-sm">
                    {app.name}
                  </h3>
                  <p className="text-sm text-stone-200">{app.description}</p>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold text-orange-200">
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
