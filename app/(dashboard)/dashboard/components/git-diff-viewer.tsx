"use client"

import React from 'react'
import ReactDiffViewer from 'react-diff-viewer'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"

interface DiffData {
  actualCode: string
  newCode: string
  hint: string
  lineNumber: number
  category: string
  title: string
}

export default function GitDiffViewer({ diffData }: { diffData: DiffData }) {
  const { actualCode, newCode, category, title } = diffData
  const { theme } = useTheme()

  const isDarkMode = true

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {category}: {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReactDiffViewer
          disableWordDiff={true}
          oldValue={actualCode}
          newValue={newCode}
          splitView={true}
          leftTitle="Actual Code"
          rightTitle="New Code"
          hideLineNumbers={false}
          showDiffOnly={false}
          useDarkTheme={isDarkMode}
          styles={{
            variables: {
              dark: {
                diffViewerBackground: '#1e1e1e',
                diffViewerColor: '#cccccc',
                addedBackground: '#044B53',
                addedColor: '#ffffff',
                removedBackground: '#632F34',
                removedColor: '#ffffff',
                wordAddedBackground: '#055d67',
                wordRemovedBackground: '#7d383f',
                addedGutterBackground: '#034148',
                removedGutterBackground: '#632b30',
                gutterBackground: '#1e1e1e',
                gutterBackgroundDark: '#262626',
                highlightBackground: '#2a3967',
                highlightGutterBackground: '#2d4077',
              },
              light: {
                diffViewerBackground: '#f7f7f7',
                diffViewerColor: '#212121',
                addedBackground: '#e6ffed',
                addedColor: '#24292e',
                removedBackground: '#ffeef0',
                removedColor: '#24292e',
                wordAddedBackground: '#acf2bd',
                wordRemovedBackground: '#fdb8c0',
                addedGutterBackground: '#cdffd8',
                removedGutterBackground: '#ffdce0',
                gutterBackground: '#f7f7f7',
                gutterBackgroundDark: '#f1f1f1',
                highlightBackground: '#fffbdd',
                highlightGutterBackground: '#fff5b1',
              },
            },
            contentText: {
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.5',
            },
            gutter: {
              minWidth: '60px',
            },
          }}
        />
      </CardContent>
    </Card>
  )
}
