// This pulls the "Josefin Sans" or others font from Google Fonts via Next.js. No need <link> or <head>.
import { Josefin_Sans } from "next/font/google";
const josans = Josefin_Sans({
  subsets: ["latin"], // language styles. Ex: "vietnamese" --> "Chào buổi sáng"
  display: "swap", // browser will use a fallback system font immediately, then “swap” in Josefin Sans once it’s downloaded.
});

import "@/app/_styles/globals.css";
import Header from "@/app/_components/Header";
import { ReservationProvider } from "./_contexts/ReservationContext";

export const metadata = {
  // title: "The Wild Oasis", // basic title method
  title: {
    template: "%s | The Wild Oasis", // %s where child-page tilte replace
    default: "Welcome | The Wild Oasis", // default --> page without title
  },
  description:
    "Luxurious cabin hotel, located in the heart of Italian Dolomites, surronded by beautful mountains and dark forests",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${josans.className} antialiased bg-primary-950 text-primary-100 min-h-screen flex flex-col`}
      >
        <Header />

        <div className="flex-1 px-8 py-12 grid">
          <main className="max-w-7xl mx-auto w-full">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
