'use client'

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./dashboard/components/sidebar";
import { FilesProvider } from './dashboard/context/files-context';


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
      <FilesProvider>
        <SidebarProvider>
          <Sidebar />
          <main className="w-full overflow-auto ">
            {children}
          </main>
        </SidebarProvider>
      </FilesProvider>
    </div>
  )
}
