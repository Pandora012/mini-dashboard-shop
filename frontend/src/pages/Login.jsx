import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login gagal. Periksa email dan kata sandi Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-950 lg:grid-cols-2">
      <section className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative flex items-center gap-3 text-white">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400 text-xl font-black text-slate-950">S</div>
          <span className="font-semibold tracking-wide">Salespace</span>
        </div>
        <div className="relative">
          <p className="text-sm font-medium text-cyan-300">Dashboard E-Commerce & Penjualan</p>
          <h1 className="mt-4 max-w-lg text-5xl font-semibold leading-tight tracking-tight text-white">Kelola produk dan penjualan dalam satu tempat.</h1>
          <p className="mt-5 max-w-md leading-7 text-slate-400">Pantau stok, catat transaksi, dan lihat perkembangan bisnis tanpa kerumitan.</p>
        </div>
        <p className="relative text-sm text-slate-500">Product Management & Sales Analytics</p>
      </section>
      <section className="grid place-items-center bg-slate-50 p-5 sm:p-8">
        <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-300/40 sm:p-9">
          <div className="mb-8 lg:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400 font-black text-slate-950">S</div>
          </div>
          <p className="text-sm font-medium text-cyan-700">Selamat datang</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Masuk ke akun Anda</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Gunakan akun admin atau staff untuk melanjutkan.</p>
          {error && <p className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
          <div className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Kata sandi</span>
              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
            </label>
          </div>
          <button disabled={loading} className="mt-7 w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Memproses..." : "Masuk"}
          </button>
          <p className="mt-5 text-center text-xs text-slate-400">Demo: admin@example.com / password</p>
        </form>
      </section>
    </main>
  );
}
