'use client'
import { Button } from "../ui/button";
import Step from "./Step";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/clients";
import { cn } from "@/lib/utils";
import ReviewingStep from "./ReviewingStep";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import React from "react";
import { createPayment } from "@/app/publish/actions";
import ReviewingStepDetails from "./ReviewingStepDetails";
import { useLocalStorage } from "@/lib/localStorage";


function renderStep(step: Step) {
    if (!('type' in step)) {
        return null;
    }
    try {
        switch (step.type) {
            case 'repositoryScan':
                return step as RepositoryScanStep
            case 'relativeFiles':
                return step as RelativeFilesStep
            case 'sensitiveFiles':
                return step as SensitiveFilesStep
            case 'inDepthAnalysis':
                return step as InDepthAnalysisStep
            default:
                return <p>Unable to find data</p>
        }
    }
    catch (e) {
        console.error(e);
    }
}

// Function to parse the data field if it's a string
function parseStepData(step: Step): Step {
    if (step.status === "success" && typeof step.data === "string") {
        try {
            // Attempt to parse the data field
            const correctedData = (step.data as string).replace(/'/g, '"');
            const parsedData = JSON.parse(correctedData);

            // You might want to add additional validation here to ensure parsedData is of the correct type
            // For simplicity, we're directly assigning the parsed data
            step.data = parsedData;
        } catch (error) {
            console.error("Failed to parse step data:", error);
            // Handle the error appropriately - maybe set data to null or keep it as the original string
        }
    }
    return step;
}

export default function Steps() {
    const [auditType, setAuditType] = useLocalStorage('auditType', '');
     const [url, setUrl] = useLocalStorage('url', '');
    const [api, setApi] = React.useState<CarouselApi>()
    const [steps, setSteps] = useState<Step[]>(
        [
            { stepName: "connecting", progress: 0, message: "Waiting to connect", status: 'pending', time: new Date() },
            { stepName: "cloning", progress: 0, message: "Waiting to clone", status: 'pending', time: new Date() },
            { stepName: "identifying", progress: 0, message: "Waiting to identify relevent files", status: 'pending', time: new Date() },
        ]
    );

    const eventQueue = useRef<Step[]>([]);
    const isProcessing = useRef(false);

    const processQueue = useCallback(() => {
        if (isProcessing.current || eventQueue.current.length === 0) return;

        isProcessing.current = true;
        const event = eventQueue.current.shift();

        if (event) {
            setSteps(prevSteps => [{ ...event }, ...prevSteps]);
            setTimeout(() => {
                isProcessing.current = false;
                processQueue();
            }, 2500);
        }
    }, [steps, setSteps]);

    const addEventToQueue = useCallback((event: Step) => {
        eventQueue.current.push(event);
        processQueue();
    }, [processQueue]);


    // addEventToQueue({
    //     stepName: 'reviewing',
    //     time: new Date(),
    //     type: 'inDepthAnalysis',
    //     status: 'success',
    //     message: 'In depth analysis finished',
    //     data: [{ 'issues': [{ 'language': 'Python', 'lineNumber': 56, 'initialCode': 'if __name__ == "__main__":\n    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="info", reload=bool(os.getenv(\'DEV\',False)), reload_dirs=["app"])', 'solvingCode': '# Ensure that the code is not executed when this script is imported as a module\nif __name__ == "__main__":\n    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="info", reload=bool(os.getenv(\'DEV\',False)), reload_dirs=["app"])', 'comment': 'The main block should be protected to avoid executing unnecessary code when the script is imported', 'suggestion': "Use the if __name__ == '__main__': condition to ensure that the code is only executed when the script is run directly" }], 'path': 'git-repo-data.git/app/main.py' }, { 'issues': [{ 'language': 'Python', 'lineNumber': 16, 'initialCode': '        assert (\n            os.getenv("OPENAI_API_KEY") is not None\n        ), "No API key detected, please setup your API key as an environement variable under the name OPENAI_API_KEY"', 'solvingCode': '        assert "OPENAI_API_KEY" in os.environ, "No API key detected, please setup your API key as an environemnt variable under the name OPENAI_API_KEY"', 'comment': "Using 'os.getenv' with assert to check for the existence of an environment variable is not the best practice.", 'suggestion': "Use 'os.environ.get' method with 'in' operator which is clearer and safer." }, { 'language': 'Python', 'lineNumber': 60, 'initialCode': '         return self.call(message=message)', 'solvingCode': '         return self.call(message=message.copy())', 'comment': "Modifying the 'message' list after returning it might lead to unexpected behavior.", 'suggestion': "Return a copy of the 'message' list to avoid any unintended modifications." }], 'path': 'git-repo-data.git/app/utils/analysis/ml.py' }, { 'issues': [{ 'language': 'Python', 'lineNumber': 61, 'initialCode': '62. // Create EventSource for SSE endpoint', 'solvingCode': "const eventSource = new EventSource('http://127.0.0.1:8000/stream/repositories/analysis/');", 'comment': "The code is referencing EventSource without importing it. EventSource is part of the browser's Web API and not available in the Python backend environment.", 'suggestion': 'Remove the reference to EventSource as it is not valid in the Python backend. If server-sent events (SSE) are required, handle it on the server-side using appropriate libraries.' }], 'path': 'git-repo-data.git/app/routers/stream/repositories.py' }, { 'issues': [{ 'language': 'Python', 'lineNumber': 184, 'initialCode': "CLONE_DIR = Path(repository_url.split('/')[-1])", 'solvingCode': "CLONE_DIR = Path('cloned_repo') / Path(repository_url.split('/')[-1])", 'comment': 'Reassigning the variable CLONE_DIR without using the Path data type and hardcoded path is risky.', 'suggestion': 'Reassign CLONE_DIR using the Path data type along with the correct path.' }], 'path': 'git-repo-data.git/app/routers/ws/repositories.py' }, { 'issues': [{ 'language': 'Python', 'lineNumber': 114, 'initialCode': 'def count_lines(file_path):', 'solvingCode': 'def count_lines(file_path: str) -> int:', 'comment': "Lack of type hint for function argument 'file_path'", 'suggestion': "Add type hint for the 'file_path' argument to improve code readability and maintainability." }, { 'language': 'Python', 'lineNumber': 127, 'initialCode': 'Repo.clone_from(repo_url, clone_dir)', 'solvingCode': 'Repo.clone_from(repo_url, clone_dir.resolve())', 'comment': "Using 'clone_dir' directly without applying path resolution", 'suggestion': "Resolve the 'clone_dir' to its absolute path before cloning the repository to avoid unexpected behavior." }, { 'language': 'Python', 'lineNumber': 144, 'initialCode': 'def count_lines(file_path):', 'solvingCode': 'def count_lines(file_path: str) -> int:', 'comment': "Lack of type hint for function argument 'file_path'", 'suggestion': "Add type hint for the 'file_path' argument to improve code readability and maintainability." }, { 'language': 'Python', 'lineNumber': 172, 'initialCode': 'if type(clone_dir) == str:', 'solvingCode': 'if isinstance(clone_dir, str):', 'comment': 'Using type() function instead of isinstance() for type comparison', 'suggestion': 'Use the isinstance() function for type comparison to check if the variable is of a certain type.' }], 'path': 'git-repo-data.git/app/utils/analysis/files_analyser.py' }]
    // } as Step)

    const [ws, setWs] = useState<WebSocket | null>(null);
    const [finished, setFinished] = useState(false);

    const startAnalysis = useCallback(async (websocket: any) => {
        toast.error('Starting analysis');
        if (websocket) {
            toast.info('Starting analysis');
            // Get JWT token from user
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            websocket.send(JSON.stringify(
                {
                    token: token,
                    repositoryURL: url,
                    auditType: auditType
                })
            );
        }
    }, [ws]);


    useEffect(() => {
        const wsAddress = process.env.NEXT_PUBLIC_WS_ADDRESS;
        if (!wsAddress) {
            toast.error('Unable to connect to server, please contact support.')
            return;
        }

        const socket = new WebSocket(wsAddress);
        setWs(socket);

        socket.onmessage = (event) => {
            // Decode the message to a json object
            try {
                const json = JSON.parse(event.data);
                const step = parseStepData(json);
                const error = json.error;
                console.log(step)
                addEventToQueue(step);
                if (error) {
                    toast.error(error);
                    return;
                }
            }
            catch (e) {
                console.error(e);
            }

        };

        socket.onclose = (event) => {
            toast.error(JSON.stringify(event));
            toast.error('Connection closed');
            setFinished(true);
        }

        socket.onopen = (event) => {
            // startAnalysis(socket);
            setFinished(false);
        }

        // Cleanup function to close the WebSocket connection when the component unmounts
        return () => {
            socket.close();
        };
    }, []);


    return (
        <div className="flex items-center justify-center flex-col gap-y-4 w-full">
            <Carousel setApi={setApi} className="max-w-lg w-full">
                <CarouselContent>
                    <CarouselItem className="w-full">
                        <Card

                            className={cn(
                                "basis-1 relative max-w-lg bg-gray-100 border-none sm:py-12 sm:px-8 rounded-xl flex flex-col items-center",
                            )}
                        >
                            <CardContent className={cn(
                                "m-4 w-full border rounded-xl relative bg-gray-50 flex flex-col justify-center py-4 gap-y-2",
                                steps.filter(step => step.stepName === 'reviewing').length > 0 && "transition-transform sm:-translate-y-12"
                            )}>
                                <Step state={steps.filter(step => step.stepName === 'connecting')[0]}></Step>
                                <Step state={steps.filter(step => step.stepName === 'cloning')[0]}></Step>
                                <Step state={steps.filter(step => step.stepName === 'identifying')[0]}></Step>
                                {
                                    steps.filter(step => step.stepName === 'reviewing').length > 0 &&
                                    <div id="subSection"
                                        className="absolute -bottom-12 px-6 left-0 w-[90%] ml-[5%] rounded-xl bg-gray-200 shadow-lg "
                                    >
                                        <ReviewingStep
                                            repositoryScanState={steps.filter(step => step.type === 'repositoryScan')[0] as RepositoryScanStep}
                                            relativeFilesState={steps.filter(step => step.type === 'relativeFiles')[0] as RelativeFilesStep}
                                            sensitiveFilesStep={steps.filter(step => step.type === 'sensitiveFiles')[0] as SensitiveFilesStep}
                                            inDepthAnalysisState={steps.filter(step => step.type === 'inDepthAnalysis')[0] as InDepthAnalysisStep}
                                        ></ReviewingStep>
                                    </div>
                                }
                            </CardContent>
                            <CardFooter className="flex flex-col gap-y-4">
                                <CardTitle className="font-light text-lg">Analyzing your repository with care</CardTitle>
                                <Separator />
                                <CardDescription className="text-center font-light">
                                    Using best scored large language models in code analysis, we ensure code meets quality standards.
                                    <br />
                                    <br />
                                    You will get a full report regarding found issues and independent developers are going to give you in-depth recommendation to improve your code
                                </CardDescription>
                            </CardFooter>
                            {!finished ?
                                <Button onClick={() => startAnalysis(ws)}>Start analysis</Button>
                                :
                                <Button onClick={() => api?.scrollNext()}>See results </Button>
                            }
                        </Card>

                    </CarouselItem>
                    {steps.filter(step => step.stepName === 'reviewing').length > 0 &&
                        <CarouselItem className="w-full overflow-hidden">
                            <Card
                                className={cn(
                                    "relative w-full max-w-lg bg-gray-100 border-none sm:py-12 sm:px-8 rounded-xl flex flex-col items-center",
                                )}
                            >
                                <CardContent className={cn(
                                    "m-4 w-full border rounded-xl relative bg-gray-50 flex flex-col justify-center py-4 gap-y-2",
                                )}>
                                    <ReviewingStep
                                        repositoryScanState={steps.filter(step => step.type === 'repositoryScan')[0] as RepositoryScanStep}
                                        relativeFilesState={steps.filter(step => step.type === 'relativeFiles')[0] as RelativeFilesStep}
                                        sensitiveFilesStep={steps.filter(step => step.type === 'sensitiveFiles')[0] as SensitiveFilesStep}
                                        inDepthAnalysisState={steps.filter(step => step.type === 'inDepthAnalysis')[0] as InDepthAnalysisStep}
                                    ></ReviewingStep>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-y-4 w-full">
                                    <CardTitle className="font-light text-lg">Here is a first glance at our analysis</CardTitle>
                                    <Separator />
                                    <CardDescription className="text-center font-light w-full">
                                        <ReviewingStepDetails
                                            repositoryScanState={steps.filter(step => step.type === 'repositoryScan')[0] as RepositoryScanStep}
                                            relativeFilesState={steps.filter(step => step.type === 'relativeFiles')[0] as RelativeFilesStep}
                                            sensitiveFilesStep={steps.filter(step => step.type === 'sensitiveFiles')[0] as SensitiveFilesStep}
                                            inDepthAnalysisState={steps.filter(step => step.type === 'inDepthAnalysis')[0] as InDepthAnalysisStep}
                                        ></ReviewingStepDetails>

                                        <br />
                                        <br />
                                        You will get a full report regarding found issues and independent developers are going to give you in-depth recommendation to improve your code
                                    </CardDescription>
                                </CardFooter>
                                <Button onClick={() => createPayment()}>See more</Button>
                            </Card>
                        </CarouselItem>
                    }
                </CarouselContent>
            </Carousel>
        </div>
    )
}