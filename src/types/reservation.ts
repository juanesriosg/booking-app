export interface Reservation {
  id: string;
  guest_name: string;
  entry_date: string; // ISO date string
  checkout_date: string; // ISO date string
  creation_date: string; // ISO date string
  room_number: string;
  price: number;
  deposit: number;
  booking_method: string;
  guest_phone: string;
  guest_count: number;
}
