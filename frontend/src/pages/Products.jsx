import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { RequestError } from "./Dashboard";

const emptyProduct = { name: "", category: "", price: "", stock: "" };
const formatPrice = (price) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price || 0);

export default function Products() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("loading");
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState(null);

  const loadProducts = useCallback(
    async (query = search) => {
      setStatus("loading");
      try {
        const response = await api.get("/products", {
          params: { search: query },
        });
        setProducts(response.data.data.data || []);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    },
    [search],
  );

  useEffect(() => {
    const timer = setTimeout(() => loadProducts(search), 250);
    return () => clearTimeout(timer);
  }, [search, loadProducts]);

  const removeProduct = async (product) => {
    if (!window.confirm(`Hapus produk "${product.name}"?`)) return;
    setNotice(null);
    try {
      await api.delete(`/products/${product.id}`);
      setNotice({ type: "success", text: "Produk berhasil dihapus." });
      loadProducts();
    } catch (error) {
      setNotice({
        type: "error",
        text: error.response?.data?.message || "Produk tidak dapat dihapus.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-700">Katalog</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Daftar produk
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Pantau harga, kategori, dan ketersediaan stok produk.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block">
            <span className="pointer-events-none absolute left-4 top-2.5 text-slate-400">
              Cari
            </span>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-14 pr-4 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 sm:w-64"
              placeholder="Nama produk"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          {isAdmin && (
            <button
              onClick={() =>
                setModal({ mode: "create", product: emptyProduct })
              }
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              + Tambah produk
            </button>
          )}
        </div>
      </section>
      {notice && (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${notice.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
        >
          {notice.text}
        </p>
      )}
      {status === "error" ? (
        <RequestError message="Data produk tidak dapat diambil. Coba muat ulang halaman." />
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <p className="text-sm font-medium text-slate-700">
              {status === "loading"
                ? "Memuat produk..."
                : `${products.length} produk ditemukan`}
            </p>
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
              Live catalog
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Produk</th>
                  <th className="px-4 py-3 font-medium">Kategori</th>
                  <th className="px-4 py-3 font-medium">Harga</th>
                  <th className="px-5 py-3 font-medium">Stok</th>
                  {isAdmin && (
                    <th className="px-5 py-3 text-right font-medium">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {status === "loading" ? (
                  <LoadingRows isAdmin={isAdmin} />
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {product.name}
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs text-violet-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-700">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.stock > 10 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                        >
                          {product.stock} unit
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-4 text-right">
                          <button
                            className="mr-3 text-sm font-medium text-cyan-700 hover:text-cyan-900"
                            onClick={() => setModal({ mode: "edit", product })}
                          >
                            Edit
                          </button>
                          <button
                            className="text-sm font-medium text-rose-600 hover:text-rose-800"
                            onClick={() => removeProduct(product)}
                          >
                            Hapus
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {status === "ready" && products.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              Produk tidak ditemukan.
            </p>
          )}
        </section>
      )}
      {modal && (
        <ProductModal
          mode={modal.mode}
          product={modal.product}
          onClose={() => setModal(null)}
          onSaved={(message) => {
            setModal(null);
            setNotice({ type: "success", text: message });
            loadProducts();
          }}
        />
      )}
    </div>
  );
}

function ProductModal({ mode, product, onClose, onSaved }) {
  const [form, setForm] = useState({
    ...product,
    price: String(product.price ?? ""),
    stock: String(product.stock ?? ""),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = mode === "edit";
  const updateField = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    try {
      if (isEdit) await api.put(`/products/${product.id}`, payload);
      else await api.post("/products", payload);
      onSaved(
        isEdit ? "Produk berhasil diperbarui." : "Produk berhasil ditambahkan.",
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Data produk tidak dapat disimpan.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-700">
              Manajemen produk
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {isEdit ? "Edit produk" : "Tambah produk"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            Tutup
          </button>
        </div>
        {error && (
          <p className="mt-5 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field
            label="Nama produk"
            name="name"
            value={form.name}
            onChange={updateField}
            className="sm:col-span-2"
          />
          <Field
            label="Kategori"
            name="category"
            value={form.category}
            onChange={updateField}
          />
          <Field
            label="Harga"
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={updateField}
          />
          <Field
            label="Stok"
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={updateField}
          />
        </div>
        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            disabled={saving}
            className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan produk"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        required
        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
        {...props}
      />
    </label>
  );
}
function LoadingRows({ isAdmin }) {
  return Array.from({ length: 5 }).map((_, index) => (
    <tr key={index} className="animate-pulse">
      <td className="px-5 py-4">
        <div className="h-4 w-40 rounded bg-slate-200" />
      </td>
      <td className="px-4 py-4">
        <div className="h-5 w-20 rounded-full bg-slate-200" />
      </td>
      <td className="px-4 py-4">
        <div className="h-4 w-24 rounded bg-slate-200" />
      </td>
      <td className="px-5 py-4">
        <div className="h-5 w-16 rounded-full bg-slate-200" />
      </td>
      {isAdmin && (
        <td className="px-5 py-4">
          <div className="ml-auto h-4 w-20 rounded bg-slate-200" />
        </td>
      )}
    </tr>
  ));
}
