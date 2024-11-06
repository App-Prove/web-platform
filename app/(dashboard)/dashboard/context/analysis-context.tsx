import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from "@/lib/localStorage";
import { Issue, FileTreeItem } from '@/types/analysis';

interface AnalysisContextType {
  issues: Issue[];
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
  fileTree: FileTreeItem | null;
  setFileTree: React.Dispatch<React.SetStateAction<FileTreeItem | null>>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [issues, setIssues] = useLocalStorage<Issue[]>('analysis_issues', []);
  const [fileTree, setFileTree] = useLocalStorage<FileTreeItem | null>('analysis_fileTree', null);

  const contextValue = useMemo(() => ({
    issues,
    setIssues: (newIssues: Issue[] | ((prev: Issue[]) => Issue[])) => {
      setIssues(newIssues);
    },
    fileTree,
    setFileTree: (newFileTree: FileTreeItem | null | ((prev: FileTreeItem | null) => FileTreeItem | null)) => {
      setFileTree(newFileTree);
    }
  }), [issues, fileTree, setIssues, setFileTree]);

  return (
    <AnalysisContext.Provider value={contextValue}>
      {children}
    </AnalysisContext.Provider>
  );
}
