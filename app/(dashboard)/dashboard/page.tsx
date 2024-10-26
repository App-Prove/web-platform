"use client"

import SearchBar from './components/search-bar'
import Steps from './components/steps'
export default function Dashboard() {

  return (
    <div className="flex flex-col gap-4 w-full p-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <SearchBar />
      </div>
      <Steps />
    </div>
  )
}
