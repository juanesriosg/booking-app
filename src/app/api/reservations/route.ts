import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Reservation } from '@/types/reservation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('entry_date', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const reservation: Omit<Reservation, 'id' | 'creationDate'> = body;

  const { data, error } = await supabase
    .from('reservations')
    .insert([
      {
        guest_name: reservation.guest_name,
        entry_date: reservation.entry_date,
        checkout_date: reservation.checkout_date,
        room_number: reservation.room_number,
        price: reservation.price,
        guest_phone: reservation.guest_phone,
        guest_count: reservation.guest_count,
      },
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data[0], { status: 201 });
}
