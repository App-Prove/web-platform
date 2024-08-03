'use client'
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { atomOneDark, CodeBlock } from 'react-code-blocks';
import { Terminal } from 'lucide-react';
import { ErrorAnimation, SuccessAnimation } from "../LottieAnimations";

export default function ReviewingStepDetails({
    repositoryScanState,
    relativeFilesState,
    sensitiveFilesStep,
    inDepthAnalysisState,
}: {
    repositoryScanState: RepositoryScanStep,
    relativeFilesState: RelativeFilesStep,
    sensitiveFilesStep: SensitiveFilesStep,
    inDepthAnalysisState: InDepthAnalysisStep,
}) {

    const issueSample = inDepthAnalysisState.data[0].issues[0]
    return (
        <div className=" gap-y-2 flex flex-col w-full items-center overflow-hidden">
            <p className="text-pretty w-full">
                We identified your project was based on <strong className="font-mono font-bold">{repositoryScanState.data.mostCommonProgrammingLanguages}</strong>{' '}
                with <strong className="font-mono font-bold">{repositoryScanState.data.numberOfFiles}</strong> files
                representing <strong className="font-mono font-bold">{repositoryScanState.data.totalLineCount}</strong>  lines of code. <br /> <br />
                Our algorithm identified {relativeFilesState.data.relativeFiles.length} files relative to your programming language and selected {sensitiveFilesStep.data.sensitiveFiles.length} sensitive files. <br /> <br />
                We found at least {inDepthAnalysisState.data.length} issues in your code
                here is one:</p>
            <Alert className='w-full overflow-hidden'>
                <Terminal className="h-4 w-4" />
                <AlertTitle>{issueSample.path} at line {issueSample.lineNumber}</AlertTitle>
                <AlertDescription className='flex flex-col gap-2'>
                    <div>
                        <div className='flex gap-x-2 items-center w-full'>
                            <div>
                                <ErrorAnimation></ErrorAnimation>
                            </div>
                            <p className='text-xs sm:text-sm text-left'>
                                {issueSample.comment}
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:block text-left">
 {
                issueSample.initialCode != '' &&
                <CodeBlock
                    wrapLongLines={true}
                    text={issueSample.initialCode}
                    language={issueSample.language}
                    showLineNumbers={true}
                    startingLineNumber={issueSample.lineNumber}
                    theme={atomOneDark}
                />
            }
                    </div>
                   
                    <div className='flex gap-x-2 items-center w-full'>
                        <div>
                            <SuccessAnimation></SuccessAnimation>
                        </div>
                        <p className='text-xs sm:text-sm text-pretty'>
                            {issueSample.suggestion}
                        </p>
                    </div>
                    <div className="hidden sm:block text-left">
   {
                        issueSample.solvingCode != '' &&
                        <CodeBlock
                            text={issueSample.solvingCode}
                            language={issueSample.language}
                            showLineNumbers={true}
                            startingLineNumber={issueSample.lineNumber}
                            theme={atomOneDark}
                        />
                    }
                    </div>
                 
                </AlertDescription>
            </Alert>
            
        </div>
    )
}