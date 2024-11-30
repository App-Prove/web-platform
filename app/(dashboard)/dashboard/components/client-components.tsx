"use client"

import { useEffect, useMemo } from 'react'
import SearchBar from './search-bar'
import Steps from './steps'
import { useAnalysis } from '../context/analysis-context'

export function DashboardContent() {
  const { issues, fileTree } = useAnalysis();

  const memoizedSteps = useMemo(() => {
    return <Steps initialIssues={issues} initialFileTree={fileTree || undefined} />
  }, [issues, fileTree])

  return (
    <div className="flex flex-col gap-4 w-full p-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <SearchBar />
      </div>
      {memoizedSteps}
    </div>
  )
} 