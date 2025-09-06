"use client";

import { createContext, useContext, useState } from "react";

const ReservationContext = createContext();

const initalState = { from: undefined, to: undefined };

function ReservationProvider({ children }) {
  const [range, setRange] = useState(initalState);
  const [isHasBreakfast, setIsHasBreakfast] = useState(false);

  function resetRange() {
    setRange(initalState);
  }

  return (
    <ReservationContext.Provider
      value={{ range, setRange, resetRange, isHasBreakfast, setIsHasBreakfast }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined)
    throw new Error("ReservationContext was used outside ReservationProvider");
  return context;
}

export { ReservationProvider, useReservation };
