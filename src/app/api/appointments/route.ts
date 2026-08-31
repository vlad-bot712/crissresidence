import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { generateReferenceCode, isDateValidForBooking } from "@/lib/booking";
import { sendPushNotificationToAdmins, sendEmailNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      propertyId,
      customerName,
      phone,
      email,
      peopleCount = 1,
      message,
      appointmentDate,
      appointmentTime,
      consent,
    } = body;

    // Validation
    if (!customerName || customerName.trim().length < 3) {
      return NextResponse.json({ error: "Vă rugăm să introduceți un nume valid." }, { status: 400 });
    }

    if (!phone || phone.trim().length < 9) {
      return NextResponse.json({ error: "Vă rugăm să introduceți un număr de telefon valid." }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json(
        { error: "Trebuie să fiți de acord cu contactarea pentru confirmarea vizitei." },
        { status: 400 }
      );
    }

    if (!appointmentDate || !appointmentTime) {
      return NextResponse.json({ error: "Data și ora sunt obligatorii." }, { status: 400 });
    }

    const dateCheck = isDateValidForBooking(appointmentDate);
    if (!dateCheck.valid) {
      return NextResponse.json({ error: dateCheck.reason }, { status: 400 });
    }

    // Atomic creation with slot conflict check
    const referenceCode = await generateReferenceCode();

    const appointment = await prisma.$transaction(async (tx) => {
      // Check if slot already taken
      const existing = await tx.appointment.findFirst({
        where: {
          appointmentDate,
          appointmentTime,
          status: { notIn: ["Anulată", "Client absent"] },
        },
      });

      if (existing) {
        throw new Error("Intervalul orar selectat tocmai a fost ocupat. Vă rugăm să alegeți altă oră.");
      }

      const created = await tx.appointment.create({
        data: {
          referenceCode,
          propertyId: propertyId || null,
          customerName: customerName.trim(),
          phone: phone.trim(),
          email: email?.trim() || null,
          peopleCount: Number(peopleCount) || 1,
          message: message?.trim() || null,
          appointmentDate,
          appointmentTime,
          status: "În așteptare",
        },
        include: {
          property: true,
        },
      });

      // Add status history
      await tx.appointmentStatusHistory.create({
        data: {
          appointmentId: created.id,
          oldStatus: "Inițial",
          newStatus: "În așteptare",
          reason: "Programare înregistrată online de către client.",
        },
      });

      return created;
    });

    const propertyName = appointment.property?.title || "Toate proprietățile";

    // 1. Send push notification to admin PWA
    sendPushNotificationToAdmins({
      title: "Vizită nouă",
      body: `${appointment.customerName} a programat o vizită pentru ${propertyName}.\nData: ${appointmentDate}, ora ${appointmentTime}.`,
      url: `/admin`,
      tag: `booking-${appointment.id}`,
    }).catch((e) => console.error("Push error:", e));

    // 2. Send email confirmation if email provided
    if (appointment.email) {
      sendEmailNotification({
        to: appointment.email,
        subject: `Confirmare înregistrare vizită — ${appointment.referenceCode} | Criss Residence`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #181818; background: #FAFAF8; padding: 32px; border: 1px solid rgba(197, 164, 103, 0.3);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #C5A467; font-size: 24px; margin: 0; letter-spacing: 2px; text-transform: uppercase;">CRISS RESIDENCE</h1>
              <p style="color: #707070; font-size: 12px; margin-top: 4px;">HERECLEAN • SĂLAJ</p>
            </div>
            <h2 style="font-size: 20px; color: #181818; margin-bottom: 16px;">Bună ziua, ${appointment.customerName}!</h2>
            <p style="line-height: 1.6; color: #404040;">
              Vizita dumneavoastră a fost înregistrată cu succes în sistemul nostru. Un reprezentant Criss Residence vă va contacta în cel mai scurt timp pentru confirmarea finală.
            </p>
            <div style="background: #FFFFFF; padding: 20px; border-left: 3px solid #C5A467; margin: 24px 0;">
              <p style="margin: 6px 0;"><strong>Cod programare:</strong> ${appointment.referenceCode}</p>
              <p style="margin: 6px 0;"><strong>Proprietate:</strong> ${propertyName}</p>
              <p style="margin: 6px 0;"><strong>Data:</strong> ${appointmentDate}</p>
              <p style="margin: 6px 0;"><strong>Ora:</strong> ${appointmentTime}</p>
              <p style="margin: 6px 0;"><strong>Locație:</strong> Hereclean 35/A, DC12, Sălaj</p>
              <p style="margin: 6px 0;"><strong>Status:</strong> <span style="color: #967542; font-weight: bold;">În așteptarea confirmării</span></p>
            </div>
            <p style="font-size: 13px; color: #707070; line-height: 1.5;">
              Dacă doriți să modificați sau să anulați vizita, ne puteți contacta la numărul de telefon al biroului de vânzări: <strong>0740 123 456</strong>.
            </p>
            <hr style="border: none; border-top: 1px solid rgba(197, 164, 103, 0.2); margin: 24px 0;" />
            <p style="text-align: center; font-size: 12px; color: #909090;">
              Criss Residence Hereclean — Construim locuri în care să trăiești.
            </p>
          </div>
        `,
      }).catch((e) => console.error("Email error:", e));
    }

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        referenceCode: appointment.referenceCode,
        customerName: appointment.customerName,
        phone: appointment.phone,
        email: appointment.email,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        status: appointment.status,
        propertyTitle: propertyName,
        address: appointment.property?.address || "Hereclean 35/A, DC12, Hereclean, Sălaj",
      },
    });
  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: error.message || "A apărut o eroare la salvarea programării." },
      { status: 400 }
    );
  }
}
