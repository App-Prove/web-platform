import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FilesContextType, FileTreeItem } from '@/types/analysis';


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
    if (file && file.type === 'file' && file.path) {
      const slug = encodeURIComponent(file.path);
      setSelectedFile(file.path);
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
