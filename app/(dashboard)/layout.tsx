'use client'

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./dashboard/components/sidebar";
import { FilesProvider } from './dashboard/context/files-context';
import { AnalysisProvider } from './dashboard/context/analysis-context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="text-foreground mx-auto min-h-screen flex flex-col overflow-hidden sm:overflow-visible relative w-full">
      <AnalysisProvider>
        <FilesProvider>
          <SidebarProvider>
            <Sidebar />
            <main className="w-full overflow-auto">
              {children}
            </main>
          </SidebarProvider>
        </FilesProvider>
      </AnalysisProvider>
    </div>
  )
}
