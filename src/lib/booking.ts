import prisma from "./db";

export async function generateReferenceCode(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const count = await prisma.appointment.count();
  const nextNum = (count + 1).toString().padStart(4, "0");
  const code = `CR-${currentYear}-${nextNum}`;

  // Ensure uniqueness
  const existing = await prisma.appointment.findUnique({
    where: { referenceCode: code },
  });

  if (existing) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `CR-${currentYear}-${randomSuffix}`;
  }

  return code;
}

export function isDateValidForBooking(dateString: string): { valid: boolean; reason?: string } {
  // Format expected: YYYY-MM-DD
  const [year, month, day] = dateString.split("-").map(Number);
  const selectedDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(selectedDate.getTime())) {
    return { valid: false, reason: "Data este invalidă." };
  }

  if (selectedDate < today) {
    return { valid: false, reason: "Nu se pot face programări în trecut." };
  }

  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const dayOfWeek = selectedDate.getDay();
  if (dayOfWeek === 0) {
    return { valid: false, reason: "Duminica este închis. Vă rugăm să alegeți un interval de Luni până Sâmbătă." };
  }

  return { valid: true };
}

export async function getAvailableTimeSlotsForDate(dateString: string) {
  const dateCheck = isDateValidForBooking(dateString);
  if (!dateCheck.valid) {
    return { available: [], booked: [], error: dateCheck.reason };
  }

  const [year, month, day] = dateString.split("-").map(Number);
  const selectedDate = new Date(year, month - 1, day);
  const dayOfWeek = selectedDate.getDay(); // 1-6

  // 1. Get base active slots configured for this day
  const configuredSlots = await prisma.availableTimeSlot.findMany({
    where: {
      dayOfWeek,
      isActive: true,
    },
    orderBy: { time: "asc" },
  });

  const allSlots = configuredSlots.length > 0
    ? configuredSlots.map((s) => s.time)
    : ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  // 2. Get already booked slots for this date (excluding canceled appointments)
  const existingBookings = await prisma.appointment.findMany({
    where: {
      appointmentDate: dateString,
      status: {
        notIn: ["Anulată", "Client absent"],
      },
    },
    select: {
      appointmentTime: true,
    },
  });

  const bookedSlots = new Set(existingBookings.map((b) => b.appointmentTime));

  const available = allSlots.filter((slot) => !bookedSlots.has(slot));

  return {
    date: dateString,
    allSlots,
    available,
    booked: Array.from(bookedSlots),
  };
}
