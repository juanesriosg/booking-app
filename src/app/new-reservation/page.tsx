"use client";

import { useState } from "react";

export default function NewReservationPage() {
  const [form, setForm] = useState({
    guestName: "",
    entryDate: "",
    checkoutDate: "",
    roomNumber: "",
    price: "",
    guestPhone: "",
    guestCount: "",
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
          guestName: form.guestName,
          entryDate: form.entryDate,
          checkoutDate: form.checkoutDate,
          roomNumber: form.roomNumber,
          price: Number(form.price),
          guestPhone: form.guestPhone,
          guestCount: Number(form.guestCount),
        }),
      });
      if (!res.ok) throw new Error("Error creating reservation");
      setSuccess("Reservation created!");
      setForm({
        guestName: "",
        entryDate: "",
        checkoutDate: "",
        roomNumber: "",
        price: "",
        guestPhone: "",
        guestCount: "",
      });
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Reservation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="guestName"
          placeholder="Guest Name"
          value={form.guestName}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="entryDate"
          type="date"
          placeholder="Entry Date"
          value={form.entryDate}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="checkoutDate"
          type="date"
          placeholder="Checkout Date"
          value={form.checkoutDate}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="roomNumber"
          placeholder="Room Number"
          value={form.roomNumber}
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
          name="guestPhone"
          placeholder="Guest Phone"
          value={form.guestPhone}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="guestCount"
          type="number"
          placeholder="Number of Guests"
          value={form.guestCount}
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
