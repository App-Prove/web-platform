import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Issue } from '@/types/analysis'
import { useRouter } from 'next/navigation'

interface IssuesListProps {
  issues: Issue[]
}

export default function IssuesList({ issues }: IssuesListProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const router = useRouter()

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue)
    const fileName = issue.file.split('/').pop() // Get the file name from the path
    if (fileName) {
      router.push(`/dashboard/diff/${encodeURIComponent(fileName)}`)
    }
  }

  // Group issues by file
  const issuesByFile = issues.reduce((acc, issue) => {
    if (!acc[issue.file]) {
      acc[issue.file] = [];
    }
    acc[issue.file].push(issue);
    return acc;
  }, {} as Record<string, Issue[]>);

  return (
    <div className="rounded-lg border bg-card w-full">
      <div className="grid grid-cols-5 gap-4 border-b p-4 font-medium">
        <div>File</div>
        <div>Category</div>
        <div className="col-span-2">Title</div>
        <div>Severity</div>
      </div>
      {Object.entries(issuesByFile).map(([file, fileIssues]) => (
        <div key={file}>
          <div className="bg-muted/50 p-2 font-medium">{file}</div>
          {fileIssues.map(issue => (
            <div
              key={issue.id}
              className="grid cursor-pointer grid-cols-5 gap-4 p-4 hover:bg-muted/50"
              onClick={() => handleIssueClick(issue)}
            >
              <div>{issue.category}</div>
              <div className="col-span-2">{issue.title}</div>
              <div>{issue.severity}</div>
              <div>Line {issue.lineNumber}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
