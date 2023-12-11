import { link } from "fs";
import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";

const myFont = localFont({ src: "../../public/fonts/DENSOSans-Regular.ttf" });

export const metadata: Metadata = {
  title: "Manpower Allocation & skill control Application",
  description: "Mfg. Manpower Allocation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={myFont.className}>{children}</body>
    </html>
  );
}
