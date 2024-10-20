'use server'

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // If not connected, redirect to /
  // const supabase = createClient();
  // const { data: { session } } = await supabase.auth.getSession();
  // if (!session) {
  //   redirect('/authentication');
  // }
  return (
      <div className="text-foreground  mx-auto min-h-screen flex flex-col overflow-hidden sm:overflow-visible relative w-full">
        {children}
      </div>
  )
}
