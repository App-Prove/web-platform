import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import React from "react";
import { inter, whyte } from "./fonts";
import Logo from "@/components/Logo";



export const metadata: Metadata = {
  title: "AppProve",
  description: "Improve IT safety globally",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const user = data?.user
  return (
    <html lang="en">
      <body className={inter.className}>
        <Analytics></Analytics>
        <SpeedInsights></SpeedInsights>
        <div className="dark:bg-black mx-auto  min-h-screen flex flex-col px-6 sm:px-24 overflow-visible">
          <div className="flex justify-between py-6 ">
            <div className="flex items-center gap-6">
              <Link href="/">
                <Logo></Logo>
              </Link>
              {/* <Link href="/offers">
                Offers
              </Link>
              <Link href="/publish">
                Publish
              </Link> */}
            </div>
            <div className="flex gap-6 items-center">
              <AuthButton user={user} />
            </div>
          </div>
          <div className="flex flex-1 overflow-visible">
            {children}
          </div>
          <Toaster />
          <footer className="border-t-2 border-t-accent flex gap-6 w-full justify-between items-center py-4 text-sm">
            <Link href={"/"}>
              <div className="flex items-center gap-x-2">
                <Logo></Logo>
                <p className="hidden sm:block">App-Prove</p>
              </div>
            </Link>
            <div className="flex gap-4">
              <Link href='/contact'>Contact</Link>
              <Link href='/legal'>Legal</Link>
              <Link href='/cookies'>Cookies</Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
