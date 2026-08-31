"use client";

import React, { createContext, useContext, useState } from "react";

interface BookingContextType {
  isOpen: boolean;
  selectedPropertyId?: string;
  selectedPropertyTitle?: string;
  openBooking: (propertyId?: string, propertyTitle?: string) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType>({
  isOpen: false,
  openBooking: () => {},
  closeBooking: () => {},
});

export const useBookingModal = () => useContext(BookingContext);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();
  const [selectedPropertyTitle, setSelectedPropertyTitle] = useState<string | undefined>();

  const openBooking = (propertyId?: string, propertyTitle?: string) => {
    setSelectedPropertyId(propertyId);
    setSelectedPropertyTitle(propertyTitle);
    setIsOpen(true);
  };

  const closeBooking = () => {
    setIsOpen(false);
  };

  return (
    <BookingContext.Provider
      value={{
        isOpen,
        selectedPropertyId,
        selectedPropertyTitle,
        openBooking,
        closeBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}
