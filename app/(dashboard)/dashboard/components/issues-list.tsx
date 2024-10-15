import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Issue } from '@/types/analysis'

interface IssuesListProps {
  issues: Issue[]
}

export default function IssuesList({ issues }: IssuesListProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)

  return (
    <div className="rounded-lg border bg-card w-full">
      <div className="grid grid-cols-5 gap-4 border-b p-4 font-medium">
        <div>Category</div>
        <div className="col-span-2">Title</div>
        <div>Severity</div>
        <div>Location</div>
      </div>
      {issues.map(issue => (
        <Dialog key={issue.id} >
          <DialogTrigger asChild>
            <div
              className="grid cursor-pointer grid-cols-5 gap-4 p-4 hover:bg-muted/50"
              onClick={() => setSelectedIssue(issue)}
            >
              <div>{issue.category}</div>
              <div className="col-span-2">{issue.title}</div>
              <div>{issue.severity}</div>
              <div className="text-wrap break-words">{`${issue.file}:${issue.lineNumber}`}</div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{issue.title}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <h4 className="mb-2 font-medium">Issue Details:</h4>
              <p>Category: {issue.category}</p>
              <p>Severity: {issue.severity}</p>
              <p>File: {issue.file}</p>
              <p>Line: {issue.lineNumber}</p>
            </div>
            <div className="mt-4">
              <h4 className="mb-2 font-medium">Code Snippet:</h4>
              <pre className="rounded bg-muted p-2">
                <code className="text-wrap break-words whitespace-pre-wrap">
                  {`// Code from ${issue.file}:${issue.lineNumber}\n${issue.initialCode}\n\n// Comment: ${issue.comment}\n// Suggestion: ${issue.suggestion}\n// Solving Code: ${issue.solvingCode}`}
                </code>
              </pre>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}