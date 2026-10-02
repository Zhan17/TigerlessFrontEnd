import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

// The design uses Work Sans only, at weights 400 and 500.
const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Apsu — Healthcare that speaks your language",
  description:
    "Care in the language you think in. US-licensed physicians, AI translates your consultation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${workSans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
