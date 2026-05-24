"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

import Form from "@/components/Form";
import Header from "@/components/Header";
import ErrorText from "@/components/ErrorText";

export default function NewTradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    symbol: "",
    market: "forex",
    direction: "long",
    entry_price: "",
    exit_price: "",
    stop_loss: "",
    take_profit: "",
    lot_size: "",
    pnl: "",
    risk_amount: "",
    strategy: "",
    notes: "",
    entry_time: "",
    exit_time: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Clean empty strings to null so Django doesn't complain
    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === "" ? null : v]),
    );

    try {
      await api.post("/trades/", payload);
      router.push("/");
    } catch (err: any) {
      const data = err.response?.data;
      setError(data ? JSON.stringify(data) : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <Header
          title={"Log a Trade"}
          subtitle={"Record your entry, exit and what you were thinking"}
        />

        {error && <ErrorText error={error} />}

        <Form
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          loading={loading}
          form={form}
        />
      </div>
    </main>
  );
}
