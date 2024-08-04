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
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [wsClosed, setWsClosed] = useState(false);

    const processQueue = useCallback(() => {
        if (eventQueue.current.length === 0 && wsClosed) setFinished(true);
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
    }, [steps, setSteps, wsClosed, setFinished, finished]);

    const addEventToQueue = useCallback((event: Step) => {
        eventQueue.current.push(event);
        processQueue();
    }, [processQueue]);

    useEffect(()=>{
        if (finished)api?.scrollNext();
    },[finished])

    const startAnalysis = useCallback(async (websocket: any) => {
        setStarted(true);
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
            setWsClosed(true);
        }

        socket.onopen = (event) => {
            setWsClosed(false);
            setFinished(false);
        }

        // Cleanup function to close the WebSocket connection when the component unmounts
        return () => {
            socket.close();
        };
    }, [setWsClosed, wsClosed,setFinished, finished]);


    return (
        <div className="flex items-center justify-center flex-col gap-y-4 w-full py-2">
            <Carousel setApi={setApi} className="max-w-lg w-full">
                <CarouselContent>
                    <CarouselItem className="w-full">
                        <Card
                            className={cn(
                                "basis-1 relative max-w-lg bg-gray-100 border-none sm:py-12 py-6 px-2 sm:px-8 rounded-xl flex flex-col items-center gap-y-4 sm:gap-y-2",
                            )}
                        >
                            <CardContent className={cn(
                                "m-4 w-full border rounded-xl relative bg-gray-50 flex flex-col justify-center py-4 gap-y-2",
                                steps.filter(step => step.stepName === 'reviewing').length > 0 && "transition-transform -translate-y-8 sm:-translate-y-14"
                            )}>
                                <Step state={steps.filter(step => step.stepName === 'connecting')[0]}></Step>
                                <Step state={steps.filter(step => step.stepName === 'cloning')[0]}></Step>
                                <Step state={steps.filter(step => step.stepName === 'identifying')[0]}></Step>
                                {
                                    steps.filter(step => step.stepName === 'reviewing').length > 0 &&
                                    <div id="subSection"
                                        className="absolute -bottom-14 sm:-bottom-16 px-6 left-0 w-[90%] ml-[5%] rounded-xl bg-gray-200 shadow-lg "
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
                                {!started  &&
                                    <Button onClick={() => startAnalysis(ws)}>Start analysis</Button>
                                }
                            </CardFooter>
                        </Card>

                    </CarouselItem>
                    {steps.filter(step => step.stepName === 'reviewing').length > 0 &&
                        <CarouselItem className="w-full overflow-hidden">
                            <Card
                                className={cn(
                                    "relative w-full max-w-lg bg-gray-100 border-none py-4 px-2 sm:px-8 rounded-xl flex flex-col items-center gap-y-4 sm:gap-y-2",
                                )}
                            >
                                <CardContent className={cn(
                                    "w-full border rounded-xl relative bg-gray-50 flex flex-col justify-center py-4 ",
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
                                    <ReviewingStepDetails
                                        repositoryScanState={steps.filter(step => step.type === 'repositoryScan')[0] as RepositoryScanStep}
                                        relativeFilesState={steps.filter(step => step.type === 'relativeFiles')[0] as RelativeFilesStep}
                                        sensitiveFilesStep={steps.filter(step => step.type === 'sensitiveFiles')[0] as SensitiveFilesStep}
                                        inDepthAnalysisState={steps.filter(step => step.type === 'inDepthAnalysis')[0] as InDepthAnalysisStep}
                                    ></ReviewingStepDetails>
                                    <CardDescription className="text-center font-light w-full">
                                        You will get a full report regarding found issues and independent developers are going to give you in-depth recommendation to improve your code
                                    </CardDescription>
                                    <Button onClick={() => createPayment()}>See more</Button>
                                </CardFooter>
                            </Card>
                        </CarouselItem>
                    }
                </CarouselContent>
            </Carousel>
        </div>
    )
}