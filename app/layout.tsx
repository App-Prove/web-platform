import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
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
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const user = data?.user
  return (
    <html lang="en">
      <body className={`${poppins.className} dark  bg-background scroll-smooth`}>
        <Analytics></Analytics>
        <SpeedInsights></SpeedInsights>
        <div className="text-foreground  mx-auto min-h-screen flex flex-col overflow-hidden sm:overflow-visible relative w-full">
          {/* Add the flare SVG here */}
          <div className="hidden sm:block absolute top-0 left-0 w-full overflow-hidden z-30 pointer-events-none">
            <svg width="557" height="596" viewBox="0 0 557 596" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_f_2005_637)">
                <rect x="-89.4492" y="-4.18872" width="444.686" height="18.3376" transform="rotate(37.825 -89.4492 -4.18872)" fill="#D9D9D9" fillOpacity="0.5"/>
                <rect x="-146.754" y="-89" width="444.686" height="18.3376" transform="rotate(37.825 -146.754 -89)" fill="#D9D9D9" fillOpacity="0.5"/>
                <rect x="-77.9883" y="-89" width="444.686" height="18.3376" transform="rotate(37.825 -77.9883 -89)" fill="#D9D9D9" fillOpacity="0.5"/>
                <rect x="-1.75391" y="102" width="444.686" height="18.3376" transform="rotate(37.825 -1.75391 102)" fill="#D9D9D9" fillOpacity="0.5"/>
              </g>
              <defs>
                <filter id="filter0_f_2005_637" x="-364.527" y="-295.527" width="920.552" height="891.242" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                  <feGaussianBlur stdDeviation="103.263" result="effect1_foregroundBlur_2005_637"/>
                </filter>
              </defs>
            </svg>
          </div>
          
          <div className="to-background via-background from-transparent bg-gradient-to-t fixed sm:sticky top-0 z-20 flex w-full">
            <nav className="flex py-6 w-full sm:w-5xl mx-auto box-border">
            <div className="flex items-center justify-between sm:gap-12 border rounded-xl p-2 sm:px-8 sm:py-2 bg-background/60 backdrop-blur-sm w-full sm:max-w-5xl mx-auto">
              <Link href="/" className="flex items-center gap-x-2 text-nowrap scale-75 sm:scale-10 group">
                  <Logo />
                  <p>App-Prove</p>
              </Link>
              <div className="hidden sm:flex gap-12">
                <Link href="#features" className="text-muted-foreground hover:text-primary">Fonctionnalités</Link>
                <Link href="#faq" className="text-muted-foreground hover:text-primary">FAQ</Link>
                <Link href="#compliance" className="text-muted-foreground hover:text-primary">Certifications</Link>
              </div>
              <div className="flex gap-2 scale-75 sm:scale-100">
              {/* <Button variant="outline">Se connecter</Button>
              <Button className="bg-primary text-white">S&apos;inscrire</Button> */}
              <Link href="#book-call">
                <Button className=" text-white">Contactez-nous</Button>
              </Link>
              </div>
            </div>
            </nav>
          </div>
          <div className="flex flex-1 max-w-5xl mx-auto w-full">
            {children}
          </div>
          <Toaster />
          <footer className="border-t-2 border-t-accent flex gap-6 justify-between items-center py-4 text-sm  mx-auto w-full sm:max-w-5xl">
            <Link href={"/"}>
              <div className="flex items-center gap-x-2 group">
                <Logo className="scale-50"/>
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
