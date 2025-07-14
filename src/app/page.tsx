"use client";

import { addDays, format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Reservation } from "@/types/reservation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";

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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
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

  // Prepare events for FullCalendar
  const events = reservations.map((r) => ({
    title: `${r.guest_name} (Hab. ${r.room_number})`,
    start: r.entry_date,
    end: r.checkout_date,
    allDay: true,
    id: r.id,
  }));

  // Filter reservations for selected date
  let checkin: typeof reservations = [];
  let staying: typeof reservations = [];
  let checkout: typeof reservations = [];
  if (selectedDate) {
    checkin = reservations.filter((r) => r.entry_date === selectedDate);
    checkout = reservations.filter((r) => r.checkout_date === selectedDate);
    staying = reservations.filter(
      (r) => r.entry_date < selectedDate && r.checkout_date > selectedDate
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Calendario de Reservas</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => router.push("/new-reservation")}
        >
          + Nueva Reserva
        </button>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="es"
        events={events}
        dateClick={(info) => setSelectedDate(info.dateStr)}
        height="auto"
      />
      {selectedDate && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">
            Reservas para {selectedDate}
          </h2>
          <div className="mb-2">
            <span className="font-bold">Check-in:</span>
            {checkin.length === 0 ? (
              <span className="ml-2 text-gray-500">Ninguna</span>
            ) : (
              checkin.map((r) => (
                <div key={r.id} className="text-green-700">
                  {r.guest_name} (Hab. {r.room_number})
                </div>
              ))
            )}
          </div>
          <div className="mb-2">
            <span className="font-bold">Estadía:</span>
            {staying.length === 0 ? (
              <span className="ml-2 text-gray-500">Ninguna</span>
            ) : (
              staying.map((r) => (
                <div key={r.id} className="text-blue-700">
                  {r.guest_name} (Hab. {r.room_number})
                </div>
              ))
            )}
          </div>
          <div className="mb-2">
            <span className="font-bold">Check-out:</span>
            {checkout.length === 0 ? (
              <span className="ml-2 text-gray-500">Ninguna</span>
            ) : (
              checkout.map((r) => (
                <div key={r.id} className="text-red-700">
                  {r.guest_name} (Hab. {r.room_number})
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
