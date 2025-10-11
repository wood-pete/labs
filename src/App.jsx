import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import CloudMatchupApp from "./apps/CloudMatchup.jsx";
import SevenVsApp from "./apps/SevenVs.jsx";
import Home from "./apps/Home.jsx";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/matchup", label: "Cloud Platform Match-Up" },
  { to: "/sevenvs", label: "SevenVs" },
];

function HomeShell() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-2xl border border-red-700/60 bg-black/40 p-4 shadow-lg shadow-red-900/40 backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-widest text-orange-400/80">
            Micro App Gallery
          </p>
          <h1 className="text-2xl font-semibold text-orange-200 sm:text-3xl">
            Future Works Hub
          </h1>
          <p className="mt-1 text-sm text-stone-300">
            Explore the interactive experiences. Each micro app leans into a warm
            red-orange glow for a cohesive feel.
          </p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "rounded-full border px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "border-orange-400 bg-gradient-to-r from-red-600 to-orange-500 text-white shadow"
                    : "border-red-700/80 bg-black/30 text-stone-200 hover:border-orange-400 hover:text-orange-200",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mt-6 flex-1">
        <div className="overflow-hidden rounded-3xl border border-red-700/60 bg-black/40 shadow-xl shadow-red-900/40 backdrop-blur">
          <Home />
        </div>
      </main>

      <footer className="mt-8 text-center text-xs text-stone-400">
        Crafted with a fiery palette for upcoming app experiments.
      </footer>
    </div>
  );
}

function SubPageShell({ children }) {
  return (
    <div className="mx-auto flex h-screen w-full flex-col px-4 pb-6 pt-6 sm:px-6 lg:px-10">
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950 to-orange-950 text-stone-100">
      <Routes>
        <Route path="/" element={<HomeShell />} />
        <Route
          path="/matchup"
          element={
            <SubPageShell>
              <CloudMatchupApp />
            </SubPageShell>
          }
        />
        <Route
          path="/sevenvs"
          element={
            <SubPageShell>
              <SevenVsApp />
            </SubPageShell>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
