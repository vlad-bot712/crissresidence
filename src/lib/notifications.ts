import webpush from "web-push";
import prisma from "./db";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@crissresidence.ro";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  icon?: string;
}

export async function sendPushNotificationToAdmins(payload: PushNotificationPayload) {
  if (!vapidPublicKey || !vapidPrivateKey) {
    console.warn("VAPID keys not configured, skipping web push");
    return { count: 0, sent: 0 };
  }

  const subscriptions = await prisma.pushSubscription.findMany();
  if (subscriptions.length === 0) {
    return { count: 0, sent: 0 };
  }

  let sentCount = 0;
  const data = JSON.stringify({
    title: payload.title,
    body: payload.body,
    icon: payload.icon || "/icons/icon-192.png",
    url: payload.url || "/admin",
    tag: payload.tag || "criss-residence-update",
  });

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        data
      );
      sentCount++;
    } catch (err: any) {
      console.error("Failed to send push notification to:", sub.endpoint, err.message);
      // Remove invalid subscription (410 Gone / 404 Not Found)
      if (err.statusCode === 410 || err.statusCode === 404) {
        await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
      }
    }
  }

  return { count: subscriptions.length, sent: sentCount };
}

export async function sendEmailNotification({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Criss Residence <programari@crissresidence.ro>",
          to: [to],
          subject,
          html,
        }),
      });
      return await res.json();
    } catch (e) {
      console.error("Resend error:", e);
    }
  }

  // Fallback / local dev logging
  console.log(`[EMAIL DISPATCH] To: ${to} | Subject: ${subject}`);
  return { simulated: true };
}
