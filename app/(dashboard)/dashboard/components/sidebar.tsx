"use client"

import * as React from "react"
import Link from "next/link"
import { BarChart, Code, FileWarning, Shield } from 'lucide-react'
import { Button } from "@/components/ui/button"
import UserMenu from './user-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import FileTree from "./file-tree"
import { useAnalysis } from '../context/analysis-context'

export default function AppSidebar() {
  const { issues, fileTree } = useAnalysis();

  const memoizedFileTree = React.useMemo(() => {
    return <FileTree initialFileTree={fileTree || undefined} initialIssues={issues} />
  }, [fileTree, issues])

  return (
    <Sidebar className="w-64 border-r bg-muted/40">
      <SidebarHeader className="p-4">
        <Link href="/dashboard">
          <h1 className="text-2xl font-bold">App-Prove</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            {fileTree || issues.length > 0 ? memoizedFileTree : <p>No analysis data</p>}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  )
}
