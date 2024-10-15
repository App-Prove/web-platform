'use server'

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    // exchange code for session
    const supabase = createClient();

    return (
        <div className="h-screen flex flex-col justify-center items-center ">
            {children}
        </div>
    )
}