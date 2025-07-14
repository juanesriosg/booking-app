"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Reservation } from "@/types/reservation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

// Helper to get all days between two dates (inclusive)

export default function Home() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch("/api/reservations");
        if (!res.ok) throw new Error("Failed to fetch reservations");
        const data = await res.json();
        setReservations(data);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchReservations();
  }, []);

  // Prepare events for FullCalendar
  const events = reservations.map((r) => ({
    title: `${r.guest_name} (Hab. ${r.room_number})`,
    start: r.entry_date,
    end: r.checkout_date,
    allDay: true,
    id: r.id,
    extendedProps: r,
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
        eventClick={(info) => {
          const reservation = reservations.find(r => r.id === info.event.id);
          setSelectedReservation(reservation || null);
          setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }}
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
      {selectedReservation && (
        <div ref={detailsRef} className="mt-8 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-2">Detalles de la Reserva</h2>
          <div><b>Nombre:</b> {selectedReservation.guest_name}</div>
          <div><b>Habitación:</b> {selectedReservation.room_number}</div>
          <div><b>Check-in:</b> {selectedReservation.entry_date}</div>
          <div><b>Check-out:</b> {selectedReservation.checkout_date}</div>
          <div><b>Teléfono:</b> {selectedReservation.guest_phone}</div>
          <div><b>Huéspedes:</b> {selectedReservation.guest_count}</div>
          <div><b>Precio:</b> ${selectedReservation.price}</div>
          <div><b>Creada:</b> {selectedReservation.creation_date ? new Date(selectedReservation.creation_date).toLocaleString() : ''}</div>
          <button
            className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => setSelectedReservation(null)}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}
