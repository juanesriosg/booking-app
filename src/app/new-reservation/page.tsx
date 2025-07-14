"use client";

import { useState } from "react";

export default function NewReservationPage() {
  const [form, setForm] = useState({
    guest_name: "",
    entry_date: "",
    checkout_date: "",
    room_number: "",
    price: "",
    guest_phone: "",
    guest_count: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_name: form.guest_name,
          entry_date: form.entry_date,
          checkout_date: form.checkout_date,
          room_number: form.room_number,
          price: Number(form.price),
          guest_phone: form.guest_phone,
          guest_count: Number(form.guest_count),
        }),
      });
      if (!res.ok) throw new Error("Error creating reservation");
      setSuccess("Reservation created!");
      setForm({
        guest_name: "",
        entry_date: "",
        checkout_date: "",
        room_number: "",
        price: "",
        guest_phone: "",
        guest_count: "",
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Create Reservation</h1>
        <button
          type="button"
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => window.location.href = "/"}
        >
          ← Back
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="guest_name"
          placeholder="Guest Name"
          value={form.guest_name}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="entry_date"
          type="date"
          placeholder="Entry Date"
          value={form.entry_date}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="checkout_date"
          type="date"
          placeholder="Checkout Date"
          value={form.checkout_date}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="room_number"
          placeholder="Room Number"
          value={form.room_number}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="guest_phone"
          placeholder="Guest Phone"
          value={form.guest_phone}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="guest_count"
          type="number"
          placeholder="Number of Guests"
          value={form.guest_count}
          onChange={handleChange}
          required
          min="1"
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Create Reservation"}
        </button>
        {success && <div className="text-green-600">{success}</div>}
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
}
