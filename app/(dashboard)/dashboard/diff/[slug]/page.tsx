"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import GitDiffViewer from '../../components/git-diff-viewer'
import { useFiles } from '../../context/files-context'
import { FileTreeItem } from '@/types/analysis'
import BottomBar from '../../components/bottom-bar'

function findFileByPath(tree: FileTreeItem | null, path: string): FileTreeItem | null {
  if (!tree) return null
  if (tree.path === path && tree.type === 'file') return tree
  if (tree.children) {
    for (const child of tree.children) {
      const found = findFileByPath(child, path)
      if (found) return found
    }
  }
  return null
}

export default function DiffViewerPage() {
  const { slug } = useParams()
  const { fileTree } = useFiles()
  const [selectedErrorIndex, setSelectedErrorIndex] = useState(0)
  
  const filePath = decodeURIComponent(slug as string)
  const file = findFileByPath(fileTree, filePath)

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
    <div className="w-full h-screen overflow-hidden flex flex-col gap-4">
      <div className="w-full h-full">
        <GitDiffViewer diffData={diffData} />
      </div>
      <BottomBar file={file} selectedErrorIndex={selectedErrorIndex} setSelectedErrorIndex={setSelectedErrorIndex} />
    </div>
  )
}
