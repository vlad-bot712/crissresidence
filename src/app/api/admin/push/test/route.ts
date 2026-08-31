import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { sendPushNotificationToAdmins } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  try {
    const res = await sendPushNotificationToAdmins({
      title: "Test Notificare Criss Residence",
      body: "Sistemul de notificări push este activ și funcționează perfect pe dispozitivul tău!",
      url: "/admin",
      tag: "test-notification",
    });

    return NextResponse.json({
      success: true,
      message: `Notificare trimisă către ${res.sent} din ${res.count} dispozitive abonate.`,
      result: res,
    });
  } catch (e: any) {
    console.error("Push test error:", e);
    return NextResponse.json({ error: e.message || "Eroare la trimiterea notificării." }, { status: 500 });
  }
}
