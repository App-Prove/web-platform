import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import React from "react";
import { poppins, whyte } from "./fonts";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";



export const metadata: Metadata = {
  title: "AppProve",
  description: "Improve IT safety globally",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} dark  bg-background scroll-smooth`}>
        <Analytics></Analytics>
        <SpeedInsights></SpeedInsights>
        {children}
      </body>
    </html>
  );
}
