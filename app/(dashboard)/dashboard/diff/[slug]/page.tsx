"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import GitDiffViewer from '../../components/git-diff-viewer'
import { useFiles, FileTreeItem } from '../../context/files-context'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'

function findFileByName(tree: FileTreeItem | null, name: string): FileTreeItem | null {
  if (!tree) return null
  if (tree.name === name && tree.type === 'file') return tree
  if (tree.children) {
    for (const child of tree.children) {
      const found = findFileByName(child, name)
      if (found) return found
    }
  }
  return null
}

export default function DiffViewerPage() {
  const { slug } = useParams()
  const { fileTree } = useFiles()
  const [selectedErrorIndex, setSelectedErrorIndex] = useState(0)
  
  const fileName = decodeURIComponent(slug as string)
  const file = findFileByName(fileTree, fileName)

  if (!file) {
    return <div className="container mx-auto py-8">File not found</div>
  }

  if (!file.errors || file.errors.length === 0) {
    return <div className="container mx-auto py-8">No issues found for this file</div>
  }

  const selectedError = file.errors[selectedErrorIndex]
  const diffData = {
    actualCode: selectedError.actualCode || '',
    newCode: selectedError.newCode || '',
    hint: selectedError.hint || '',
    lineNumber: selectedError.lineNumber || 1,
    category: selectedError.category,
    title: selectedError.title
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <GitDiffViewer diffData={diffData} />
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">PROBLEMS</CardTitle>
        </CardHeader>
        <CardContent>
          {file.errors.map((error, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 p-2 rounded cursor-pointer ${
                index === selectedErrorIndex ? 'bg-muted' : 'hover:bg-muted/50'
              }`}
              onClick={() => setSelectedErrorIndex(index)}
            >
              <AlertCircle className={`w-5 h-5 mt-0.5 ${
                error.category === 'Security' ? 'text-red-500' :
                error.category === 'Performance' ? 'text-yellow-500' :
                'text-blue-500'
              }`} />
              <div>
                <p className="font-medium">{error.category}: {error.title}</p>
                <p className="text-sm text-muted-foreground">Line {error.lineNumber}</p>
                <p className="text-sm mt-1">{error.hint}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
