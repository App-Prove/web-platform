import Steps from "@/components/Publish/Steps";
import { Toaster } from "@/components/ui/sonner";

export default function AnalysisPage() {
    return (
        <div className="w-full flex flex-col gap-2">
            <div className="absolute"><Toaster></Toaster></div>
            <Steps></Steps>
        </div>
    )
}