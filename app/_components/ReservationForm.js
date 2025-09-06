"use client";

import { useReservation } from "@/app/_contexts/ReservationContext";
import { differenceInDays } from "date-fns";
import Image from "next/image";
import { createBooking } from "@/app/_lib/actions";
import { toUTC } from "@/app/_lib/helper";
import SubmitButton from "./SubmitButton";

function ReservationForm({ cabin, user, settings }) {
  const { range, resetRange, isHasBreakfast, setIsHasBreakfast } =
    useReservation();
  const { id, maxCapacity, regularPrice, discount } = cabin;
  const { breakfastPrice } = settings;

  const startDate = toUTC(range?.from);
  const endDate = toUTC(range?.to);

  const numNights = differenceInDays(endDate, startDate);
  const extrasPrice = isHasBreakfast ? breakfastPrice * numNights : 0;
  const cabinPrice = (regularPrice - discount) * numNights;
  const totalPrice = cabinPrice + extrasPrice;

  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    totalPrice,
    extrasPrice,
    cabinId: id,
  };

  const createBookingWithData = createBooking.bind(null, bookingData);

  return (
    <div className="scale-[1.01] min-w-[450px] h-full flex flex-col">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        <div className="flex gap-4 items-center">
          <Image
            // Important to display google profile images
            referrerPolicy="no-referrer"
            className="rounded-full"
            src={user.image}
            alt={`avatar of ${user.name}`}
            width={30}
            height={30}
          />
          <p>{user.name}</p>
        </div>
      </div>

      <form
        //1st version
        // action={createBookingWithData}
        action={async (formData) => {
          await createBookingWithData(formData);
          resetRange();
        }}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col grow"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="space-y-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="hasBreakfast"
            name="hasBreakfast"
            checked={isHasBreakfast}
            value={isHasBreakfast}
            onChange={(e) => setIsHasBreakfast(e.target.checked)}
            className="h-5 w-5 accent-primary-500 shadow-sm rounded-sm"
          />
          <label htmlFor="hasBreakfast">
            Would like to have breakfast everyday (${breakfastPrice}
            <span className="text-sm">/day</span>).
          </label>
        </div>

        <div className="flex justify-end items-center gap-6">
          {!(startDate && endDate) ? (
            <p className="text-primary-300 text-base">
              Start by selecting dates
            </p>
          ) : (
            <SubmitButton pendingLabel="Reserving...">Reserve now</SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
