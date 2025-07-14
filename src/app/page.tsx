"use client";

import { addDays, format, isWithinInterval, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Reservation } from "@/types/reservation";

// Helper to get all days between two dates (inclusive)
function getDatesBetween(start: string, end: string) {
  const dates: string[] = [];
  let current = parseISO(start);
  const last = parseISO(end);
  while (current <= last) {
    dates.push(format(current, "yyyy-MM-dd"));
    current = addDays(current, 1);
  }
  return dates;
}

export default function Home() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [calendar, setCalendar] = useState<{
    [date: string]: { checkin: Reservation[]; checkout: Reservation[]; staying: Reservation[] };
  }>({});
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

  // Calendar logic
  useEffect(() => {
    if (!reservations.length) return;
    const map: { [date: string]: { checkin: Reservation[]; checkout: Reservation[]; staying: Reservation[] } } = {};
    reservations.forEach((r) => {
      const days = getDatesBetween(r.entry_date, r.checkout_date);
      days.forEach((day) => {
        if (!map[day]) map[day] = { checkin: [], checkout: [], staying: [] };
        if (day === r.entry_date) map[day].checkin.push(r);
        if (day === r.checkout_date) map[day].checkout.push(r);
        if (day !== r.entry_date && day !== r.checkout_date) map[day].staying.push(r);
      });
    });
    setCalendar(map);
  }, [reservations]);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reservations Calendar</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => router.push("/new-reservation")}
        >
          + New Reservation
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && Object.keys(calendar).length === 0 && (
        <div>No reservations found.</div>
      )}
      {!loading && !error && Object.keys(calendar).length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Check-in</th>
                <th className="border px-2 py-1">Staying</th>
                <th className="border px-2 py-1">Check-out</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(calendar)
                .sort()
                .map((date) => (
                  <tr key={date}>
                    <td className="border px-2 py-1 font-semibold">{date}</td>
                    <td className="border px-2 py-1">
                      {calendar[date].checkin.map((r) => (
                        <div key={r.id} className="text-green-700">
                          {r.guest_name} (Room {r.room_number})
                        </div>
                      ))}
                    </td>
                    <td className="border px-2 py-1">
                      {calendar[date].staying.map((r) => (
                        <div key={r.id} className="text-blue-700">
                          {r.guest_name} (Room {r.room_number})
                        </div>
                      ))}
                    </td>
                    <td className="border px-2 py-1">
                      {calendar[date].checkout.map((r) => (
                        <div key={r.id} className="text-red-700">
                          {r.guest_name} (Room {r.room_number})
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
