"use client";

import ReservationCard from "@/app/_components/ReservationCard";
import { deleteBooking } from "@/app/_lib/actions";
import { useOptimistic } from "react";

//487. Removing reservation Immediately (Jonas)
function ReservationList({ bookings }) {
  // useOptimistic(currentState , update func)
  // uses for? --> update UI immediately + actions run on Background --> Improve UX (faster UI response)
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  async function handleDelete(bookingId) {
    optimisticDelete(bookingId); // using optimistic
    await deleteBooking(bookingId); // server actions
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
