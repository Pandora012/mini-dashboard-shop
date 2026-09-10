import { useEffect, useState } from "react";
import { RequestError } from "./Dashboard";
import api from "../services/api";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api
      .get("/activity-logs")
      .then((response) => {
        setLogs(response.data.data.data || []);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium text-cyan-700">Audit trail</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
          Aktivitas sistem
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Riwayat login dan perubahan data oleh pengguna.
        </p>
      </section>
      {status === "error" ? (
        <RequestError message="Aktivitas tidak dapat dimuat." />
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          {status === "loading" ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : logs.length ? (
            logs.map((log) => (
              <article
                key={log.id}
                className="flex gap-4 rounded-xl p-4 transition hover:bg-slate-50"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cyan-50 text-cyan-700">
                  ◷
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-6 text-slate-800">
                    {log.action_description}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(log.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <p className="p-10 text-center text-sm text-slate-500">
              Belum ada aktivitas tercatat.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
