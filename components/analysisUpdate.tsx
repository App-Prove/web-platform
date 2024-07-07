"use client"
import { useCallback, useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { createClient } from '@/utils/supabase/clients';
import { toast, Toaster } from 'sonner';
import { useLocalStorage } from '@/lib/localStorage';
import Lottie from 'react-lottie';
import valid from '@/public/lottie/valid.json';
import error from '@/public/lottie/error.json';
import analyzing from '@/public/lottie/analyzing.json';
import { Card, CardContent, CardHeader } from './ui/card';
import { createPayment } from '@/app/publish/actions';

type RepositoryScanData = {
    numberOfFiles: number;
    totalLineCount: number;
    commonLanguages: string[];
};

type RelativeFilesData = {
    relativeFiles: {
        path: string;
        language: string;
    }[]
};

type SensitiveFilesData = {
    sensitiveFiles: {
        path: string;
        language: string;
    }[]; // Contains file paths
};

type InDepthAnalysisData = {
    issues: {
        lineNumber: number;
        comment: string;
        suggestion: string;
        path: string;
    }[];
    path: string;
}[];


type Step = {
    status: "pending" | "analyzing" | "error";
    message: string;
} | {
    status: "success";
    message: string;
    type: "repositoryScan";
    data: RepositoryScanData;
} | {
    status: "success";
    message: string;
    type: "relativeFiles";
    data: RelativeFilesData;
} | {
    status: "success";
    message: string;
    type: "sensitiveFiles";
    data: SensitiveFilesData;
}
    | {
        status: "success";
        message: string;
        type: "inDepthAnalysis";
        data: InDepthAnalysisData;
    }
// type Step = {
//     status?: "pending" | "success" | "analyzing" | "error";
//     message?: string;
//     type?: StepType;
//     data?: StepData;
// }

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


export default function WebSocketComponent() {
    const [message, setMessage] = useState('');
    const [steps, setSteps] = useState<Step[]>([]);
    const [repositoryURL, setRepositoryURL] = useState('');
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [url, setUrl] = useLocalStorage('url', '');
    const [finished, setFinished] = useState(false);

    const startAnalysis = useCallback(async (websocket: any) => {
        toast.error('Starting analysis');
        if (websocket) {
            // Get JWT token from user
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            console.log(session);
            const token = session?.access_token;
            websocket.send(JSON.stringify(
                {
                    token: token,
                    repositoryURL: url,
                })
            );
            setRepositoryURL('');
        }
    }, [ws, url]);


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
                steps.push(step);
                if (error) {
                    toast.error(error);
                    return;
                }
            }
            catch (e) {
                console.error(e);
            }

            setMessage(event.data);
        };

        socket.onclose = (event) => {
            toast.error('Connection closed');
            setFinished(true);
        }

        socket.onopen = (event) => {
            toast.success('Connection established');
            setFinished(false);
            // startAnalysis(socket);
        }

        return () => {
            socket.close();
        };
    }, []);





    const defaultOptions = {
        autoplay: true,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    function renderStepType(step: Step) {
        switch (step.status) {
            case 'error':
                return <Lottie
                    options={{ ...defaultOptions, animationData: error, loop: true }}
                    height={24}
                    width={24}
                />
            case 'success':
                return <Lottie
                    options={{ ...defaultOptions, animationData: valid, loop: false }}
                    height={24}
                    width={24}
                />
            case 'pending':
                return <div className='flex gap-x-1 items-center'>
                    <span className='w-2 h-2 rounded-full bg-orange animate-pulse'></span>
                    <span className='w-2 h-2 rounded-full bg-orange animate-pulse'></span>
                    <span className='w-2 h-2 rounded-full bg-orange animate-pulse'></span>
                </div>
            case 'analyzing':
                return <Lottie
                    options={{ ...defaultOptions, animationData: analyzing, loop: true }}
                    height={24}
                    width={24}
                />
            default:
                return <div>Unidentified step</div>;
        }
    }

    function renderStepData(step: Step) {
        if (step.status == 'success') {
            try {
                switch (step.type) {
                    case 'repositoryScan':
                        return <ul>
                            <li>Language:{step.data?.commonLanguages}</li>
                            <li>Number of files {step.data?.numberOfFiles}</li>
                            <li>Accounting for {step.data?.totalLineCount} lines</li>
                        </ul>
                    case 'relativeFiles':
                        return <div>{step.data?.relativeFiles.map((file, index) => (
                            <p key={`relativeFiles-${file.path}`}>{file.path} {file.language}</p>
                        ))}</div>
                    case 'sensitiveFiles':
                        // Check if there are no sensitive files
                        if (step.data?.sensitiveFiles.length === 0) {
                            return <p>No sensitive files found</p>
                        }
                        return <div>{step.data?.sensitiveFiles.map((file) => (
                            <p key={`sensitiveFiles-${file.path}`}>{file.path} {file.language}</p>
                        ))}</div>
                    case 'inDepthAnalysis':
                        // Check if empty array
                        if (step.data?.length === 0) {
                            return <p>No issues found</p>
                        }
                        return <div>
                            {step.data?.map((file) => (
                                <div key={`inDepthAnalysis-${file.path}`}>
                                    <p>{file.path}</p>
                                    {
                                        file.issues.map((issue, index) => (
                                            <div key={`inDepthAnalysis-${file.path}-issue-${index}`}>
                                                <p>Line:{issue.lineNumber}</p>
                                                <p>Comment: {issue.comment}</p>
                                                <p>Suggestion: {issue.suggestion}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            ))}
                        </div>
                    default:
                        return <p>Unable to find data</p>
                }
            }
            catch (e) {
                console.error(e);
            }
        }
    }

    return (
        <div className='flex flex-col gap-4 w-full items-start mb-8'>
            {steps.map((step, index) => (
                <div key={index} className='flex flex-col sm:flex-row gap-2 w-full justify-center'>
                    <Card className='w-full'>
                        <CardHeader>

                            <div className='flex gap-x-2 w-fit justify-center'>
                                {renderStepType(step)}
                                <p className='flex w-fit'>{step.message}</p>
                            </div>
                        </CardHeader>
                        {(step.status == 'success' && step.data) &&
                            <CardContent>
                                {renderStepData(step)}
                            </CardContent>
                        }
                    </Card>
                </div>
            ))}
            <div className='self-end flex flex-col gap-2 w-fit'>

                {!finished &&
                    <Button onClick={() => startAnalysis(ws)}>Start analysis</Button>
                }
                <Button onClick={() => createPayment()}>Go to payment</Button>
            </div>
            <Toaster></Toaster>
        </div >
    );
}
