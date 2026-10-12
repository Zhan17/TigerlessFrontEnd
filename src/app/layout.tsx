import type { Metadata } from "next";
import { workSans } from "./fonts";
import "./globals.css";

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
