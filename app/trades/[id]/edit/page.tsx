"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import Form from "@/components/Form";


// Format datetime for input[type=datetime-local]
const toDatetimeLocal = (iso: string | null) => {
  if (!iso) return "";
  return iso.slice(0, 16);
};

export default function EditTradePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    api
      .get(`/trades/${id}/`)
      .then((res) => {
        const t = res.data;
        setForm({
          symbol: t.symbol ?? "",
          market: t.market ?? "forex",
          direction: t.direction ?? "long",
          entry_price: t.entry_price ?? "",
          exit_price: t.exit_price ?? "",
          stop_loss: t.stop_loss ?? "",
          take_profit: t.take_profit ?? "",
          lot_size: t.lot_size ?? "",
          pnl: t.pnl ?? "",
          risk_amount: t.risk_amount ?? "",
          strategy: t.strategy ?? "",
          notes: t.notes ?? "",
          entry_time: toDatetimeLocal(t.entry_time),
          exit_time: toDatetimeLocal(t.exit_time),
        });
      })
      .catch(() => setError("Could not load trade."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === "" ? null : v]),
    );

    try {
      await api.put(`/trades/${id}/`, payload);
      router.push("/");
    } catch (err: any) {
      setError(JSON.stringify(err.response?.data ?? "Something went wrong."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this trade? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/trades/${id}/`);
      router.push("/");
    } catch {
      setError("Could not delete trade.");
      setDeleting(false);
    }
  };


  if (loading)
    return (
      <main
        className="min-h-screen bg-gray-950 text-white p-6 flex items-center
                     justify-center"
      >
        <p className="text-gray-400">Loading trade...</p>
      </main>
    );

  if (!form) return null;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Edit Trade</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Update or delete this entry
            </p>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400
                       border border-red-500/30 font-semibold px-4 py-2
                       rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Trade"}
          </button>
        </div>

        {error && (
          <div
            className="bg-red-500/10 border border-red-500/30 text-red-400
                          rounded-lg p-4 mb-6 text-sm"
          >
            {error}
          </div>
        )}

        <Form
          handleSubmit={handleSave}
          handleChange={handleChange}
          loading={loading}
          form={form}
          saving={saving}
        />
      </div>
    </main>
  );
}
