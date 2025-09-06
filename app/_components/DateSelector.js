"use client";

import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import {
  differenceInCalendarDays,
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { useState } from "react";
import { useReservation } from "../_contexts/ReservationContext";

function isAlreadyBooked(range, datesArr) {
  return (
    range?.from &&
    range?.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from, end: range.to })
    )
  );
}

export function minRange(range, minBookingLength) {
  return (date) => {
    // only apply if one day is picked
    if (!range?.from || range?.to) return false;

    const diff = Math.abs(differenceInCalendarDays(date, range?.from));
    // {min} days before and after selected date
    return diff > 0 && diff < minBookingLength;
  };
}

function DateSelector({ settings, bookedDates, cabin }) {
  const { range, setRange, resetRange, isHasBreakfast } = useReservation();
  const displayRange = isAlreadyBooked(range, bookedDates) ? {} : range;

  const { regularPrice, discount } = cabin;
  const numNights = differenceInDays(displayRange?.to, displayRange?.from);
  const cabinPrice = numNights * (regularPrice - discount);

  // SETTINGS
  const { minBookingLength, maxBookingLength, breakfastPrice } = settings;
  // ExtraPrice (Breakfast)
  const extrasPrice = isHasBreakfast ? breakfastPrice * numNights : 0;
  const totalPrice = cabinPrice + extrasPrice;

  // set up for "go to today"
  const today = new Date();
  const [month, setMonth] = useState();

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="my-3 mt-3 place-self-center flex justify-around"
        mode="range"
        onSelect={setRange}
        selected={displayRange}
        min={minBookingLength}
        max={maxBookingLength}
        defaultMonth={today}
        startMonth={today}
        endMonth={new Date(today.getFullYear() + 5, 11, 31)}
        captionLayout="dropdown"
        numberOfMonths={2}
        month={month}
        onMonthChange={setMonth}
        animate
        navLayout="around"
        disabled={(curDate) =>
          isPast(curDate) ||
          bookedDates.some((date) => isSameDay(date, curDate))
        }
        excludeDisabled
        modifiers={{
          tooClose: minRange(range, minBookingLength),
        }}
        modifiersClassNames={{
          tooClose: "opacity-50", // fade the dates that within "min"
        }}
      />
      <button
        className="mb-5 cursor-pointer hover:text-accent-500 hover:underline place-self-center py-2 px-2"
        onClick={() => setMonth(today)}
      >
        Go to Today
      </button>

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">
                  ${totalPrice} {isHasBreakfast ? `(+$${extrasPrice})` : ""}
                </span>
              </p>
            </>
          ) : null}
        </div>

        {range?.from || range?.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
