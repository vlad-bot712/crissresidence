import React from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { BookingProvider } from "@/components/public/BookingContext";
import BookingModal from "@/components/public/BookingModal";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BookingProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <BookingModal />
        <Footer />
      </div>
    </BookingProvider>
  );
}
