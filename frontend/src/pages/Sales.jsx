import { useEffect, useMemo, useState } from "react";
import { RequestError } from "./Dashboard";
import api from "../services/api";

const money = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
const blankItem = () => ({ product_id: "", quantity: 1 });

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([blankItem()]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/products")
      .then((response) => {
        setProducts(response.data.data.data || []);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum +
          (products.find((product) => product.id === Number(item.product_id))
            ?.price || 0) *
            Number(item.quantity || 0),
        0,
      ),
    [items, products],
  );
  const updateItem = (index, key, value) =>
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await api.post("/sales", {
        items: items.map((item) => ({
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
        })),
      });
      setItems([blankItem()]);
      setMessage({
        type: "success",
        text: "Transaksi berhasil disimpan dan stok telah diperbarui.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Transaksi gagal disimpan.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (status === "error")
    return (
      <RequestError message="Data produk untuk transaksi tidak dapat dimuat." />
    );

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium text-cyan-700">Transaksi baru</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
          Catat penjualan
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Pilih lebih dari satu produk, lalu stok akan otomatis dikurangi.
        </p>
      </section>
      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Item penjualan</h2>
            <button
              type="button"
              className="rounded-lg bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-100"
              onClick={() => setItems((current) => [...current, blankItem()])}
            >
              + Tambah item
            </button>
          </div>
          {status === "loading" ? (
            <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => {
                const product = products.find(
                  (entry) => entry.id === Number(item.product_id),
                );
                return (
                  <div
                    key={index}
                    className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[1fr_110px_92px]"
                  >
                    <select
                      required
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-cyan-500"
                      value={item.product_id}
                      onChange={(event) =>
                        updateItem(index, "product_id", event.target.value)
                      }
                    >
                      <option value="">Pilih produk</option>
                      {products.map((entry) => (
                        <option
                          key={entry.id}
                          value={entry.id}
                          disabled={entry.stock === 0}
                        >
                          {entry.name} · stok {entry.stock}
                        </option>
                      ))}
                    </select>
                    <input
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-cyan-500"
                      type="number"
                      min="1"
                      max={product?.stock || undefined}
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(index, "quantity", event.target.value)
                      }
                    />
                    {items.length > 1 ? (
                      <button
                        type="button"
                        className="rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                        onClick={() =>
                          setItems((current) =>
                            current.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          )
                        }
                      >
                        Hapus
                      </button>
                    ) : (
                      <span className="px-3 py-2 text-right text-sm font-medium text-slate-600">
                        {product ? money(product.price * item.quantity) : "-"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {message && (
            <p
              className={`mt-5 rounded-xl px-4 py-3 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
            >
              {message.text}
            </p>
          )}
        </section>
        <aside className="h-fit rounded-2xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-300/50">
          <p className="text-sm text-slate-400">Total pembayaran</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {money(total)}
          </p>
          <div className="my-6 h-px bg-slate-800" />
          <p className="text-sm leading-6 text-slate-400">
            Harga yang tersimpan adalah harga saat transaksi dibuat.
          </p>
          <button
            disabled={saving || status !== "ready"}
            className="mt-6 w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan transaksi"}
          </button>
        </aside>
      </form>
    </div>
  );
}
