import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FAFAF8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Criss Residence Hereclean",
    default: "Criss Residence Hereclean — Locuințe Moderne & Exclusiviste",
  },
  description:
    "Dezvoltator rezidențial de vile moderne în Hereclean, Sălaj. Construcții premium la cele mai înalte standarde arhitecturale.",
  keywords: [
    "case hereclean",
    "criss residence",
    "case salaj",
    "case zalau",
    "case moderne hereclean",
    "terenuri de vanzare hereclean",
    "constructii case salaj",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/logo.png",
    apple: "/icons/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ro"
      className={`${cormorant.variable} ${jakarta.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#181818] antialiased selection:bg-[#C5A467]/20 selection:text-[#181818]">
        {children}
      </body>
    </html>
  );
}
