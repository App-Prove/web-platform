import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Issue, FileTreeItem } from '@/types/analysis'
import { useFiles } from '../context/files-context'
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface IssuesListProps {
  issues: Issue[]
  fileTree: FileTreeItem
}

export default function IssuesList({ issues, fileTree }: IssuesListProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const router = useRouter()
  const { setSelectedFile } = useFiles()

  const rootPath = useMemo(() => fileTree.name, [fileTree])

  useEffect(() => {
    console.log('File Tree:', JSON.stringify(fileTree, null, 2))
    console.log('Issues:', issues)
  }, [fileTree, issues])

  const handleIssueClick = (issue: Issue) => {
    console.log('Clicked issue:', issue)
    setSelectedIssue(issue)
    if (issue.file) {
      const fileItem = findFileInTree(fileTree, issue.file)
      console.log('Found file item:', fileItem)
      if (fileItem) {
        setSelectedFile(fileItem)
        const fullPath = fileItem.path || `${rootPath}/${issue.file.replace(/^\//, '')}`
        const encodedPath = encodeURIComponent(fullPath)
        const navigateTo = `/dashboard/diff/${encodedPath}`
        console.log('Attempting to navigate to:', navigateTo)
        router.push(navigateTo)
      } else {
        console.error('File not found in tree:', issue.file)
      }
    } else {
      console.error('Issue has no file path:', issue)
    }
  }

  function findFileInTree(tree: FileTreeItem, path: string): FileTreeItem | null {
    console.log('Searching for path:', path, 'in tree:', tree)
    const normalizedPath = path.replace(/^\//, '').toLowerCase()
    const normalizedTreePath = (tree.path || tree.name || '').replace(/^\//, '').toLowerCase()

    if (normalizedTreePath.includes(normalizedPath) || normalizedPath.includes(normalizedTreePath)) {
      console.log('Found matching file:', tree)
      return tree
    }

    if (tree.children) {
      for (const child of tree.children) {
        const found = findFileInTree(child, path)
        if (found) return found
      }
    }
    return null
  }

  // Group issues by file path
  const issuesByFile = issues.reduce((acc, issue) => {
    const path = issue.file || "Unknown File"
    if (!acc[path]) {
      acc[path] = [];
    }
    acc[path].push(issue);
    return acc;
  }, {} as Record<string, Issue[]>);

  return (
    <ScrollArea className="h-[calc(100vh-200px)] w-full border border-gray-700 rounded-md">
      <div className="rounded-lg bg-card w-full p-4">
        <div className="grid grid-cols-5 gap-4 border-b p-4 font-medium">
          <div className="col-span-2">Title</div>
          <div>Category</div>
          <div>Severity</div>
          <div>Line</div>
        </div>
        {Object.entries(issuesByFile).map(([filePath, fileIssues]) => (
          <div key={filePath} className="border-b last:border-b-0">
            <div className="bg-muted/50 p-2 font-medium">{filePath}</div>
            {fileIssues.map(issue => (
              <div
                key={issue.id}
                className={cn(
                  "grid cursor-pointer grid-cols-5 gap-4 p-4 hover:bg-muted/50",
                  selectedIssue?.id === issue.id && "bg-muted"
                )}
                onClick={() => handleIssueClick(issue)}
              >
                <div className="col-span-2">{issue.title}</div>
                <div>{issue.category}</div>
                <div>{issue.severity}</div>
                <div>{issue.lineNumber || 'N/A'}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  )
}
