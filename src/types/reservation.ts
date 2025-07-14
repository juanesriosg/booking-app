export interface Reservation {
  id: string;
  guestName: string;
  entryDate: string; // ISO date string
  checkoutDate: string; // ISO date string
  creationDate: string; // ISO date string
  roomNumber: string;
  price: number;
  guestPhone: string;
  guestCount: number;
}
