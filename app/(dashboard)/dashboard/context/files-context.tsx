import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface FileTreeItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileTreeItem[];
  hasError?: boolean;
  errors?: {
    category: string;
    title: string;
    lineNumber: number;
    actualCode: string;
    newCode: string;
    hint: string;
  }[];
}

interface FilesContextType {
  fileTree: FileTreeItem | null;
  isLoading: boolean;
  selectedFile: string | null;
  setSelectedFile: (file: FileTreeItem | null) => void;
  setFileTree: React.Dispatch<React.SetStateAction<FileTreeItem | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export function useFiles() {
  const context = useContext(FilesContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FilesProvider');
  }
  return context;
}

export function FilesProvider({ children }: { children: React.ReactNode }) {
  const [fileTree, setFileTree] = useState<FileTreeItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const router = useRouter();

  const handleSetSelectedFile = (file: FileTreeItem | null) => {
    if (file && file.type === 'file') {
      const slug = encodeURIComponent(file.name);
      setSelectedFile(file.name);
      router.push(`/dashboard/diff/${slug}`);
    }
  };

  return (
    <FilesContext.Provider value={{ 
      fileTree, 
      isLoading, 
      selectedFile,
      setSelectedFile: handleSetSelectedFile, 
      setFileTree, 
      setIsLoading 
    }}>
      {children}
    </FilesContext.Provider>
  );
}
