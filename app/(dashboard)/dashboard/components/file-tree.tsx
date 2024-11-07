import React, { useState, useEffect, useMemo } from 'react'
import { ChevronRight, ChevronDown, Folder, File, AlertCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useFiles } from '../context/files-context'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { FileTreeItem, Issue } from '@/types/analysis'

function hasErrorInSubtree(item: FileTreeItem): boolean {
  if (item.hasError) return true
  if (item.children) {
    return item.children.some(child => hasErrorInSubtree(child))
  }
  return false
}

const FileTreeNode: React.FC<{ item: FileTreeItem; depth: number }> = ({ item, depth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const { setSelectedFile, selectedFile } = useFiles();

  const shouldBeOpen = useMemo(() => hasErrorInSubtree(item), [item])
  useEffect(() => {
    setIsOpen(shouldBeOpen)
  }, [shouldBeOpen])

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      setSelectedFile(item);
    }
  };

  const isSelected = selectedFile === item.name;

  const fileContent = (
    <>
      {hasChildren ? (
        isOpen ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />
      ) : (
        <span className="w-4 h-4 mr-1" />
      )}
      {item.type === 'folder' ? <Folder className="w-4 h-4 mr-2" /> : <File className="w-4 h-4 mr-2" />}
      <span className={cn(
        item.hasError && "text-red-400"
      )}>{item.name}</span>
      {item.hasError && <AlertCircle className="w-4 h-4 ml-2 text-red-500" />}
    </>
  );

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "flex items-center py-1 px-2 cursor-pointer hover:bg-gray-800",
                depth > 0 && "ml-4",
                isSelected && "bg-gray-700"
              )}
              onClick={handleClick}
            >
              {fileContent}
            </div>
          </TooltipTrigger>
          {item.hasError && (
            <TooltipContent side="top" className="z-50 bg-gray-900 text-white p-2 rounded shadow-lg">
              {item.errors?.map((error, index) => (
                <div key={index} className="mb-1">
                  <span className="font-bold">{error.category}:</span> {error.title} (Line {error.lineNumber})
                </div>
              ))}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      {isOpen && hasChildren && (
        <div>
          {item.children!.map((child, index) => (
            <FileTreeNode key={index} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

interface FileTreeProps {
  initialFileTree?: FileTreeItem | null;
  initialIssues?: Issue[];
}

export default function FileTree({ initialFileTree, initialIssues }: FileTreeProps) {
  const { fileTree: contextFileTree, isLoading, setFileTree } = useFiles()
  const [localFileTree, setLocalFileTree] = useState<FileTreeItem | null>(null)

  useEffect(() => {
    if (initialFileTree && !localFileTree) {
      setLocalFileTree(initialFileTree)
      setFileTree(initialFileTree)
    } else if (contextFileTree && !localFileTree) {
      setLocalFileTree(contextFileTree)
    }
  }, [initialFileTree, contextFileTree, setFileTree, localFileTree])

  useEffect(() => {
    if (initialIssues && initialIssues.length > 0 && localFileTree) {
      const updatedFileTree = populateFileTreeWithIssues(localFileTree, initialIssues)
      if (JSON.stringify(updatedFileTree) !== JSON.stringify(localFileTree)) {
        setLocalFileTree(updatedFileTree)
        setFileTree(updatedFileTree)
      }
    }
  }, [initialIssues, localFileTree, setFileTree])

  useEffect(() => {
    console.log("FileTree component - localFileTree:", localFileTree)
  }, [localFileTree])

  if (isLoading) return <div className="p-4 text-muted-foreground">Loading...</div>
  if (!localFileTree) return <div className="p-4 text-muted-foreground">No files found.</div>

  return (
    <div className="w-full px-4">
      <div className="font-semibold mb-2">Project Files</div>
      <ScrollArea className="h-[calc(100vh-200px)] w-full border border-gray-700 rounded-md">
        <div className="p-4">
          <FileTreeNode item={localFileTree} depth={0} />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

// Helper function to populate file tree with issues
function populateFileTreeWithIssues(tree: FileTreeItem, issues: Issue[]): FileTreeItem {
  const updatedTree = { ...tree };

  if (tree.type === 'file') {
    const fileIssues = issues.filter(issue => issue.file === tree.path);
    if (fileIssues.length > 0) {
      updatedTree.hasError = true;
      updatedTree.errors = fileIssues.map(issue => ({
        category: issue.category,
        title: issue.title,
        lineNumber: issue.lineNumber,
        actualCode: issue.initialCode,
        newCode: issue.solvingCode,
        hint: issue.suggestion
      }));
    }
  } else if (tree.type === 'folder' && tree.children) {
    updatedTree.children = tree.children.map(child => populateFileTreeWithIssues(child, issues));
    updatedTree.hasError = updatedTree.children.some(child => child.hasError);
  }

  return updatedTree;
}
