import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, setAdminSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email-ul și parola sunt obligatorii." }, { status: 400 });
    }

    const admin = await verifyAdminCredentials(email, password);
    if (!admin) {
      return NextResponse.json({ error: "Date de autentificare incorecte." }, { status: 401 });
    }

    await setAdminSessionCookie(admin);

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Eroare internă de server." }, { status: 500 });
  }
}
