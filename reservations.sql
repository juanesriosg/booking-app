-- reservations.sql
-- SQL script to create the reservations table in Supabase (PostgreSQL)

CREATE TABLE reservations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name TEXT NOT NULL,
    entry_date DATE NOT NULL,
    checkout_date DATE NOT NULL,
    creation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    room_number TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    deposit NUMERIC(10,2) DEFAULT 0,
    booking_method TEXT DEFAULT '',
    guest_phone TEXT NOT NULL,
    guest_count INTEGER NOT NULL
);

-- Optional: index for faster queries by room or date
CREATE INDEX idx_reservations_room ON reservations(room_number);
CREATE INDEX idx_reservations_entry_date ON reservations(entry_date);
