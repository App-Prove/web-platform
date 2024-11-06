import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { FileTreeItem } from "@/types/analysis";

export default function BottomBar({ file, selectedErrorIndex, setSelectedErrorIndex }: { file: FileTreeItem, selectedErrorIndex: number, setSelectedErrorIndex: (index: number) => void }) {
    return(
        <Card className='w-full h-96'>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">PROBLEMS</CardTitle>
        </CardHeader>
        <CardContent>
          {file.errors?.map((error, index) => (
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
    )
}