import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import CloudMatchupApp from "./apps/CloudMatchup.jsx";
import SevenVsApp from "./apps/SevenVs.jsx";
import ResourcePage from "./apps/resources/ResourcePage.jsx";
import ResourcesHome from "./apps/resources/ResourcesHome.jsx";
import Home from "./apps/Home.jsx";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/resources", label: "Resources" },
  { to: "/matchup", label: "Cloud Platform Match-Up" },
  { to: "/sevenvs", label: "SevenVs" },
];

function HomeShell() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <header className="relative flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
        <div className="absolute inset-x-0 -top-1 h-1 rounded-full bg-red-600" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-600">
            Micro App Garage
          </p>
          <h1 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">
            Future Works Hub
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Explore the interactive experiences. Clean lines, bold red flourishes, and a crisp, white grid echo the F1 garage aesthetic.
          </p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-wide transition",
                  isActive
                    ? "border-red-600 bg-red-600 text-white shadow-[0_6px_18px_rgba(225,6,0,0.35)]"
                    : "border-neutral-200 bg-white text-neutral-900 hover:border-red-500 hover:text-red-600",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mt-6 flex-1">
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
          <Home />
        </div>
      </main>

      <footer className="mt-10 text-center text-xs text-neutral-500">
        Built with a white chassis, black typography, and red velocity cues.
      </footer>
    </div>
  );
}

function SubPageShell({ children }) {
  return (
    <div className="mx-auto flex h-screen w-full flex-col bg-[#f5f5f5] px-1 pb-0 pt-2 text-neutral-900 sm:px-2 sm:pb-0 sm:pt-3 lg:px-3">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

function Layout() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] text-neutral-900">
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
        <Route
          path="/resources"
          element={
            <SubPageShell>
              <ResourcesHome />
            </SubPageShell>
          }
        />
        <Route
          path="/resources/:slug"
          element={
            <SubPageShell>
              <ResourcePage />
            </SubPageShell>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout />
    </BrowserRouter>
  );
}
