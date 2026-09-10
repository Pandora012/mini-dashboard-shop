import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../services/api";

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
const cards = [
  {
    key: "total_omzet",
    label: "Total omzet",
    icon: "↗",
    currency: true,
    accent: "from-cyan-400 to-blue-500",
  },
  {
    key: "total_transaksi",
    label: "Transaksi",
    icon: "◎",
    accent: "from-violet-400 to-indigo-500",
  },
  {
    key: "total_produk",
    label: "Produk aktif",
    icon: "▦",
    accent: "from-amber-300 to-orange-500",
  },
  {
    key: "total_stok",
    label: "Total stok",
    icon: "◫",
    accent: "from-emerald-300 to-teal-500",
  },
];

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [revenue, setRevenue] = useState([]);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get("/dashboard/summary"),
      api.get("/dashboard/revenue"),
      api.get("/dashboard/top-products"),
    ])
      .then(([summaryResponse, revenueResponse, productsResponse]) => {
        if (!active) return;
        setSummary(summaryResponse.data.data);
        setRevenue(revenueResponse.data.data);
        setProducts(productsResponse.data.data);
        setStatus("ready");
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") return <DashboardSkeleton />;
  if (status === "error")
    return (
      <RequestError message="Data dashboard tidak dapat dimuat. Pastikan Anda menggunakan akun admin." />
    );

  return (
    <div className="space-y-7">
      <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-7 text-white shadow-xl shadow-slate-300/60 sm:p-9">
        <p className="text-sm font-medium text-cyan-300">Ringkasan bisnis</p>
        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Pantau penjualan hari ini.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Semua angka di bawah diperbarui dari transaksi yang tercatat di
              sistem.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm backdrop-blur">
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.key}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${card.accent} font-bold text-slate-950`}
              >
                {card.icon}
              </span>
            </div>
            <p className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
              {card.currency
                ? currency.format(summary[card.key] || 0)
                : (summary[card.key] || 0).toLocaleString("id-ID")}
            </p>
          </article>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Tren omzet" subtitle="Akumulasi pendapatan per bulan">
          <ResponsiveContainer width="100%" height={270}>
            <LineChart
              data={revenue}
              margin={{ top: 10, right: 8, left: -14, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(value) => `${value / 1000000}jt`}
              />
              <Tooltip
                formatter={(value) => currency.format(value)}
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0891b2"
                strokeWidth={3}
                dot={{ r: 4, fill: "#0891b2" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="Produk terlaris"
          subtitle="Berdasarkan jumlah item terjual"
        >
          <ResponsiveContainer width="100%" height={270}>
            <BarChart
              data={products}
              margin={{ top: 10, right: 8, left: -14, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
              />
              <Bar dataKey="quantity" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </article>
  );
}
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-40 rounded-3xl bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 rounded-2xl bg-slate-200" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-80 rounded-2xl bg-slate-200" />
        <div className="h-80 rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
}
export function RequestError({ message }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-rose-700">
      <p className="font-semibold">Tidak dapat memuat halaman</p>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
}
