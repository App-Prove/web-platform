"use client"

import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./sidebar";
import { FilesProvider } from '../context/files-context';
import { AnalysisProvider } from '../context/analysis-context';

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  return (
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
  );
} 