export interface FileTreeItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileTreeItem[];
  path?: string;
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
