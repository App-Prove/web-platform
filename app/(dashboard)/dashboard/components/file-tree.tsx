import React, { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, Folder, File, AlertCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useFiles, FileTreeItem } from '../context/files-context'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const FileTreeNode: React.FC<{ item: FileTreeItem; depth: number }> = ({ item, depth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const { setSelectedFile, selectedFile } = useFiles();

  useEffect(() => {
    if (item.hasError) {
      setIsOpen(true);
    }
  }, [item.hasError]);

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
            <TooltipContent side="right" className="z-50 bg-gray-900 text-white p-2 rounded shadow-lg">
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

export default function FileTree() {
  const { fileTree, isLoading } = useFiles()

  if (isLoading) return <div className="p-4 text-muted-foreground">Loading...</div>
  if (!fileTree) return <div className="p-4 text-muted-foreground">No files found.</div>

  return (
    <div className="w-full px-4">
      <div className="font-semibold mb-2">Project Files</div>
      <ScrollArea className="h-[calc(100vh-200px)] w-full border border-gray-700 rounded-md">
        <div className="p-4">
          <FileTreeNode item={fileTree} depth={0} />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
