import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  { to: "/dashboard", label: "Dashboard", icon: "◈", adminOnly: true },
  { to: "/products", label: "Produk", icon: "▦" },
  { to: "/sales", label: "Penjualan", icon: "⊞" },
  { to: "/logs", label: "Aktivitas", icon: "◷", adminOnly: true },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 lg:flex">
      <aside className="bg-slate-950 px-5 py-5 text-slate-200 lg:fixed lg:inset-y-0 lg:w-72 lg:px-6 lg:py-7">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-xl font-black text-slate-950 shadow-lg shadow-cyan-500/20">S</div>
          <div>
            <h1 className="font-semibold tracking-wide text-white">Salespace</h1>
            <p className="text-xs text-slate-400">Dashboard E-Commerce & Penjualan</p>
          </div>
        </div>
        <nav className="mt-7 flex gap-2 overflow-x-auto lg:grid lg:overflow-visible">
          {navigation
            .filter((item) => !item.adminOnly || user?.role === "admin")
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/10" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`
                }
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
        </nav>
        <div className="mt-8 hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4 lg:block">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Signed in as</p>
          <p className="mt-2 font-medium text-white">{user?.name}</p>
          <span className="mt-2 inline-block rounded-full bg-slate-800 px-2.5 py-1 text-xs capitalize text-cyan-300">{user?.role}</span>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-5 lg:ml-72 lg:p-9">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Selamat datang kembali,</p>
            <h2 className="text-lg font-semibold text-slate-900">{user?.name}</h2>
          </div>
          <button onClick={logout} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
            Keluar
          </button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
