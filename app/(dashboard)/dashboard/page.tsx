"use client"

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import Sidebar from './components/sidebar'
import { Input } from "@/components/ui/input"
import { DashboardData } from '@/types/analysis'
import Steps from './components/steps'


export default function Dashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // promise for 1 sec
    new Promise(resolve => setTimeout(() => resolve(true), 1000))
    .then(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }


  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <div className="relative">
            <Input placeholder="Search issues..." className="pl-8" />
          </div>
        </div>
        <Steps />
      </main>
    </div>
  )
}