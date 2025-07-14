"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Reservation } from "@/types/reservation";

export default function Home() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/reservations");
        if (!res.ok) throw new Error("Failed to fetch reservations");
        const data = await res.json();
        setReservations(data);
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
    fetchReservations();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Reservations</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => router.push("/new-reservation")}
        >
          + New Reservation
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && reservations.length === 0 && (
        <div>No reservations found.</div>
      )}
      {!loading && !error && reservations.length > 0 && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Guest</th>
              <th className="border px-2 py-1">Room</th>
              <th className="border px-2 py-1">Entry</th>
              <th className="border px-2 py-1">Checkout</th>
              <th className="border px-2 py-1">Guests</th>
              <th className="border px-2 py-1">Phone</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Created</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td className="border px-2 py-1">{r.guest_name}</td>
                <td className="border px-2 py-1">{r.room_number}</td>
                <td className="border px-2 py-1">{r.entry_date}</td>
                <td className="border px-2 py-1">{r.checkout_date}</td>
                <td className="border px-2 py-1">{r.guest_count}</td>
                <td className="border px-2 py-1">{r.guest_phone}</td>
                <td className="border px-2 py-1">${r.price.toFixed(2)}</td>
                <td className="border px-2 py-1">
                  {new Date(r.creation_date).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
