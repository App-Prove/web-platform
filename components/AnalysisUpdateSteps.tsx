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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from 'lucide-react';
import { AnalyzingAnimation, ErrorAnimation, LoadingAnimation, PendingAnimation, SuccessAnimation } from './LottieAnimations';


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


export default function AnalysisUpdateSteps() {
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



    function renderStepType(step: Step) {
        switch (step.status) {
            case 'error':
                return <ErrorAnimation></ErrorAnimation>
            case 'success':
                return <SuccessAnimation></SuccessAnimation>
            case 'pending':
                return <LoadingAnimation></LoadingAnimation>
            case 'analyzing':
                return <AnalyzingAnimation></AnalyzingAnimation>
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
                            <li>Languages: {step.data?.mostCommonProgrammingLanguages.map((value,index) => (index===0 || index == step.data.mostCommonProgrammingLanguages.length)?`${value}`:`${value} ; `)}</li>
                            <li>Number of files {step.data?.numberOfFiles}</li>
                            <li>Accounting for {step.data?.totalLineCount} lines</li>
                        </ul>
                    case 'relativeFiles':
                        return <div className='flex flex-col gap-4'>{step.data?.relativeFiles.map((file, index) => (
                            <div key={`relativeFiles-${file.path}`} className='flex flex-col gap-2'>
                            <p className='font-mono'>Path: {file.path}</p>
                            <p>Language: {file.language}</p>
                            </div>
                        ))}</div>
                    case 'sensitiveFiles':
                        // Check if there are no sensitive files
                        if (step.data?.sensitiveFiles.length === 0) {
                            return <p>No sensitive files found</p>
                        }
                        return <div>{step.data?.sensitiveFiles.map((file) => (
                            <div key={`sensitiveFiles-${file.path}`} className='flex flex-col gap-2'>
                            <p>Path: {file.path}</p>
                            <p>Language: {file.language}</p>
                            </div>
                        ))}</div>
                    case 'inDepthAnalysis':
                        // Check if empty array
                        if (step.data?.length === 0) {
                            return <p>No issues found</p>
                        }
                        return <div className='flex flex-col gap-2'>
                            {step.data?.map((file) => (
                                <div key={`inDepthAnalysis-${file.path}`} className='flex gap-2 flex-col'>
                                    {
                                        file.issues.length === 0 &&
                                        <Alert>
                                            <Terminal className="h-4 w-4" />
                                            <AlertTitle>{file.path}</AlertTitle>
                                            <AlertDescription>
                                                Our algorithm didn&apos;t find any issues in this file. We recommend getting a second opinion from a human.
                                            </AlertDescription>
                                        </Alert>

                                    }
                                    {
                                        file.issues.map((issue, index) => (
                                            <div key={`inDepthAnalysis-${file.path}-issue-${index}`}>
                                                <Alert className='w-full overflow-hidden'>
                                                    <Terminal className="h-4 w-4" />
                                                    <AlertTitle>{file.path} at line {issue.lineNumber}</AlertTitle>
                                                    <AlertDescription className='flex flex-col gap-2'>
                                                        <div className='flex gap-x-2 items-center w-full'>
                                                            <div>
                                                               <ErrorAnimation></ErrorAnimation>
                                                            </div>
                                                            <p className='text-xs sm:text-sm'>
                                                                {issue.comment}
                                                            </p>
                                                        </div>
                                                        <div className='flex gap-x-2 items-center w-full'>
                                                            <div>
                                                                <SuccessAnimation></SuccessAnimation>
                                                            </div>
                                                            <p className='text-xs sm:text-sm text-pretty'>
                                                                {issue.suggestion}
                                                            </p>
                                                        </div>
                                                    </AlertDescription>
                                                </Alert>
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
        <div className='flex flex-col gap-4 w-full items-start mb-8 overflow-hidden min-h-96'>
            {steps.map((step, index) => (
                <div key={index} className='flex flex-col sm:flex-row gap-2 w-full justify-center'>
                    <Card className='w-full'>
                        <CardHeader>
                            <div className='flex gap-x-2 w-full'>
                                <div className='justify-center flex items-center'>
                                {renderStepType(step)}
                                </div>
                                <p className='flex flex-wrap w-full'>{step.message}</p>
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
            <div className='flex flex-col gap-2 w-full h-full justify-between'>
                {!finished &&
                    <Button onClick={() => startAnalysis(ws)} className='self-start' variant={'secondary'}>Start analysis</Button>
                }
                <Button onClick={() => createPayment()} className='self-end'>Go to payment</Button>
            </div>
            <Toaster></Toaster>
        </div >
    );
}
