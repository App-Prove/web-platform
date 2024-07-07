import WebSocketComponent from "@/components/analysisUpdate";

export default function AnalysisPage(){
    // Identify number of files

    // Identify number of lines

    // Identify type of project

    // Identify complexity of project

    
    return(
        <div className="w-full flex flex-col gap-2">
            <h1>Analysis Page</h1>
            <WebSocketComponent></WebSocketComponent>
        </div>
    )
}