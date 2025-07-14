"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditReservationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [form, setForm] = useState({
    guest_name: "",
    entry_date: "",
    checkout_date: "",
    room_number: "",
    price: "",
    deposit: "",
    guest_phone: "",
    guest_count: "",
    booking_method: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchReservation = async () => {
      const res = await fetch(`/api/reservations`);
      const data = await res.json();
      const reservation = data.find((r: Record<string, unknown>) => r.id === id);
      if (reservation) {
        setForm({
          guest_name: reservation.guest_name || "",
          entry_date: reservation.entry_date || "",
          checkout_date: reservation.checkout_date || "",
          room_number: reservation.room_number || "",
          price: reservation.price?.toString() || "",
          deposit: reservation.deposit?.toString() || "",
          guest_phone: reservation.guest_phone || "",
          guest_count: reservation.guest_count?.toString() || "",
          booking_method: reservation.booking_method || "",
        });
      }
    };
    fetchReservation();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (form.entry_date >= form.checkout_date) {
      setError("La fecha de entrada debe ser anterior a la fecha de salida.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form, price: Number(form.price), guest_count: Number(form.guest_count), deposit: Number(form.deposit) }),
      });
      if (!res.ok) throw new Error("Error al actualizar la reserva");
      setSuccess("¡Reserva actualizada!");
    } catch (err) {
      setError((err as Error).message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Editar Reserva</h1>
        <button
          type="button"
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => router.push("/")}
        >
          ← Volver
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col w-full">
          <label htmlFor="guest_name" className="mb-1 text-sm text-gray-700">Nombre del huésped</label>
          <input
            id="guest_name"
            name="guest_name"
            placeholder="Nombre del huésped"
            value={form.guest_name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col w-full">
            <label htmlFor="entry_date" className="mb-1 text-sm text-gray-700">Fecha de entrada</label>
            <input
              id="entry_date"
              name="entry_date"
              type="date"
              value={form.entry_date}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="checkout_date" className="mb-1 text-sm text-gray-700">Fecha de salida</label>
            <input
              id="checkout_date"
              name="checkout_date"
              type="date"
              value={form.checkout_date}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="room_number" className="mb-1 text-sm text-gray-700">Número de habitación</label>
          <input
            id="room_number"
            name="room_number"
            placeholder="Número de habitación"
            value={form.room_number}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="price" className="mb-1 text-sm text-gray-700">Precio</label>
          <input
            id="price"
            name="price"
            type="number"
            placeholder="Precio"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="deposit" className="mb-1 text-sm text-gray-700">Abono</label>
          <input
            id="deposit"
            name="deposit"
            type="number"
            placeholder="Abono"
            value={form.deposit}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="booking_method" className="mb-1 text-sm text-gray-700">Vía de reserva</label>
          <select
            id="booking_method"
            name="booking_method"
            value={form.booking_method}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Seleccione una opción</option>
            <option value="booking">Booking</option>
            <option value="reserva en hotel">Reserva en hotel</option>
            <option value="whatsapp">Whatsapp</option>
            <option value="llamada">Llamada</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="guest_phone" className="mb-1 text-sm text-gray-700">Teléfono del huésped</label>
          <input
            id="guest_phone"
            name="guest_phone"
            placeholder="Teléfono del huésped"
            value={form.guest_phone}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="guest_count" className="mb-1 text-sm text-gray-700">Número de huéspedes</label>
          <input
            id="guest_count"
            name="guest_count"
            type="number"
            placeholder="Número de huéspedes"
            value={form.guest_count}
            onChange={handleChange}
            required
            min="1"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Actualizar Reserva"}
        </button>
        {success && <div className="text-green-600">{success}</div>}
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
}
