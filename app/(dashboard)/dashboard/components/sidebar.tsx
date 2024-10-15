import { BarChart, Code, FileWarning, Shield } from 'lucide-react'
import { Button } from "@/components/ui/button"
import UserMenu from './user-menu'

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-muted/40 p-4 h-full flex flex-col">
      <h1 className="mb-4 text-2xl font-bold">App-Prove</h1>
      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start">
          <BarChart className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Shield className="mr-2 h-4 w-4" />
          Security
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <FileWarning className="mr-2 h-4 w-4" />
          Performance
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Code className="mr-2 h-4 w-4" />
          Best Practices
        </Button>
      </nav>
      <div className="mt-auto">
        <UserMenu></UserMenu>
      </div>
    </aside>
  )
}