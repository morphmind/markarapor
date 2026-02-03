import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MarkaRapor - AI-Powered Marketing Reports",
  description:
    "Dijital pazarlama profesyonelleri için AI destekli otomatik raporlama platformu",
  keywords: [
    "marketing",
    "reports",
    "AI",
    "Google Ads",
    "Analytics",
    "SEO",
    "automation",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
