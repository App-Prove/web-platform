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


    const [ws, setWs] = useState<WebSocket | null>(null);
    const [finished, setFinished] = useState(false);

    const startAnalysis = useCallback(async (websocket: any) => {
        if (websocket) {
            toast.info('Starting analysis');
            // Get JWT token from user
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            websocket.send(JSON.stringify(
                {
                    token: token,
                    repositoryURL: 'hugodemenez/git-repo-data.git',
                    auditType: 'security'
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

        socket.onmessage = (event) => {
            // Decode the message to a json object
            try {
                const json = JSON.parse(event.data);
                const step = parseStepData(json);
                const error = json.error;
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
            startAnalysis(socket);
            setFinished(false);
        }

        // Cleanup function to close the WebSocket connection when the component unmounts
        return () => {
            socket.close();
        };
    }, []);

    return (
        <div className="flex items-center justify-center flex-col gap-y-4 w-full">
            <Card className="max-w-lg bg-gray-100 border-none sm:py-12 sm:px-8 rounded-xl">
                <CardContent className="m-4 border rounded-xl bg-gray-50 flex flex-col justify-center py-4 gap-y-2">
                    <Step state={steps.filter(step => step.stepName === 'connecting')[0]}></Step>
                    <Step state={steps.filter(step => step.stepName === 'cloning')[0]}></Step>
                    <Step state={steps.filter(step => step.stepName === 'identifying')[0]}></Step>
                </CardContent>
                <CardFooter className="flex flex-col gap-y-4">
                    <CardTitle className="font-light text-lg">Analyzing your repository with care</CardTitle>
                    <Separator />
                    <CardDescription className="text-center font-light">
                        Using best scored large language models in code analysis, we ensure code meets quality standards.
                        <br />
                        <br />
                        You will get as full report regarding found issues and independent developers are going to give you in-depth recommendation to improve your code
                    </CardDescription>
                </CardFooter>
            </Card>
        </div>
    )
}