"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function signInAction() {
  // (provider, {redirectTo: "/any" })
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  // (provider, {redirectTo: "/any" })
  await signOut({ redirectTo: "/" });
}

export async function UpdateGuest(formDate) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formDate.get("nationalID");
  const [nationality, countryFlag] = formDate.get("nationality").split("%");

  if (!/^[A-Za-z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, nationalID, countryFlag };

  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) {
    throw new Error("Guest could not be updated");
  }
  // force the data to be refetch to the latest (ignore the validation: ..time..)
  revalidatePath("/account/profile");
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 484. details at (11:15)
  // this one is about to get only the booking of logged-in guest and avoid "falthy deletion". Why? To avoid attacker could get the "cURL" of this action and allowed them to delete any other bookingId that had in the DB. You don't want to be able to delete someone else bookings 🤔, RIGHT 😅?!
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function updateBooking(formData) {
  const bookingId = Number(formData.get("bookingId"));

  //1. Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  //2. Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  //3. Building update date
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  //4. Mutation
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();
  //5. Error handling
  if (error) {
    throw new Error("Booking could not be updated");
  }
  //6. Revalidation
  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  //7. Redirecting
  redirect("/account/reservations");
}

export async function createBooking(bookingData, formData) {
  //1. Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    isPaid: false,
    hasBreakfast: Boolean(formData.get("hasBreakfast")),
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);
  // So that the newly created object gets returned!
  // .select()
  // .single();

  if (error) {
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}
