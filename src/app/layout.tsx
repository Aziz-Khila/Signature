import type { Metadata } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";
import "lenis/dist/lenis.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Signature — Cafe Restaurant · Borj Cédria",
  description:
    "Signature Cafe Restaurant à Borj Cédria. Pizzas au feu de bois, desserts et plats généreux.",
  icons: {
    icon: [{ url: "/logo-signature.png", type: "image/png" }],
    apple: "/logo-signature.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${instrumentSerif.variable} ${outfit.variable}`}
        suppressHydrationWarning
      >
        <div className="noise" aria-hidden="true" />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
