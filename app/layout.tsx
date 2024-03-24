import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthButton from "@/components/authButton";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeShield",
  description: "Make people trust your code.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.refreshSession();
  const {session, user} = data;
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="dark:bg-black  mx-auto h-screen max-h-screen flex flex-col px-6">
          <div className="flex  justify-between py-6">
            <div className="flex items-center gap-6">
              <Link href="/">
                <svg className="dark:fill-white fill-black hover:fill-gray-500 cursor-pointer" width="40" height="44" viewBox="0 0 40 44" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.33406 27.776C0.746028 26.3578 0.969754 23.9202 0.969754 23.9202C0.969754 23.9202 2.16319 26.0596 3.36824 26.9866C4.94698 28.201 20.0362 40.072 20.0362 40.072V43.1991L3.36824 30.0834C3.36824 30.0834 1.85021 29.0207 1.33406 27.776Z" />
                  <path d="M38.6775 27.776C39.2656 26.3578 39.0418 23.9202 39.0418 23.9202C39.0418 23.9202 37.8484 26.0596 36.6434 26.9866C35.0646 28.201 19.9754 40.072 19.9754 40.072V43.1991L36.6434 30.0834C36.6434 30.0834 38.1614 29.0207 38.6775 27.776Z" />
                  <path d="M1.33406 21.9468C0.746028 20.5287 0.969754 18.091 0.969754 18.091V0.906982L3.36824 2.57681V9.10433L3.46875 17.7571C3.39477 18.701 3.58076 20.8604 4.91662 21.9468L20.0362 34.2428V37.37L3.36824 24.2542C3.36824 24.2542 1.85021 23.1916 1.33406 21.9468Z" />
                  <path d="M38.6775 21.9468C39.2656 20.5287 39.0418 18.091 39.0418 18.091V0.906982L36.6434 2.57681V9.10433L36.5428 17.7571C36.6168 18.701 36.4308 20.8604 35.095 21.9468L19.9754 34.2428V37.37L36.6434 24.2542C36.6434 24.2542 38.1614 23.1916 38.6775 21.9468Z" />
                  <path d="M6.05135 19.6394C5.46331 18.2213 5.68704 15.7837 5.68704 15.7837V0.815918L8.08552 2.54647V6.79694L8.18604 15.4497C8.11205 16.3936 8.29804 18.5531 9.63391 19.6394L20.0362 28.8083V31.9355L8.08552 21.9468C8.08552 21.9468 6.56749 20.8842 6.05135 19.6394Z" />
                  <path d="M34.021 19.6394C34.6091 18.2212 34.3853 15.7836 34.3853 15.7836V0.846191L31.9869 2.51602V6.79686L31.8863 15.4496C31.9603 16.3935 31.7743 18.553 30.4385 19.6394L20.0362 28.8082V31.9354L31.9869 21.9468C31.9869 21.9468 33.5049 20.8841 34.021 19.6394Z" />
                </svg>
              </Link>
              <Link href="/offers">Offers</Link>
              <Link href="/auditors">Auditors</Link>
            </div>
            <div className="flex gap-6 items-center">
              <Link href="/publish">
                <Button variant="link">Publish</Button>
              </Link>
              <AuthButton user={user}/>
            </div>
          </div>
          <div className="h-full">
            {children}
          </div>
          <footer className="flex gap-6 w-full justify-center py-4">
            <p>©CodeShield</p>
            <Link href='/contact'>Contact</Link>
            <Link href='/legal-notice'>Legal notice</Link>
            <Link href='/cookies'>Cookies</Link>
          </footer>
        </div>
      </body>

    </html>
  );
}
