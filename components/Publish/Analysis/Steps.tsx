import * as React from 'react';

import { AnalyzingAnimation, ErrorAnimation, LoadingAnimation, PendingAnimation, SuccessAnimation } from '../../LottieAnimations';



/**
 * v0 by Vercel.
 * @see https://v0.dev/t/oZZdiiwgMsm
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { atomOneDark, CodeBlock } from 'react-code-blocks';
import { Terminal } from 'lucide-react';

function renderStepContent(step: Step) {
  if (!('type' in step)) {
    return null;
  }
  try {
    switch (step.type) {
      case 'repositoryScan':
        return <ul>
          <li>Identified programming languages: {step.data?.mostCommonProgrammingLanguages.map((value, index) => (index === 0 || index == step.data.mostCommonProgrammingLanguages.length) ? `${value}` : `${value} ; `)}</li>
          <li>Number of files {step.data?.numberOfFiles}</li>
          <li>Accounting for {step.data?.totalLineCount} lines</li>
        </ul>
      case 'relativeFiles':
        return <div className='flex flex-col gap-4'>{step.data?.relativeFiles.map((file, index) => (
          <div key={`relativeFiles-${file.path}`} className='flex flex-col'>
            <p className='p-2 bg-muted text-muted-foreground font-mono'>{file.path}</p>
          </div>
        ))}</div>
      case 'sensitiveFiles':
        // Check if there are no sensitive files
        if (step.data?.sensitiveFiles.length === 0) {
          return <p>No sensitive files found</p>
        }
        // return <div>{step.data?.sensitiveFiles.map((file) => (
        //   <div key={`sensitiveFiles-${file.path}`} className='flex flex-col gap-2'>
        //     <p>Path: {file.path}</p>
        //     <p>Language: {file.language}</p>
        //   </div>
        // ))}</div>
        return
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
                        <div>

                          <div className='flex gap-x-2 items-center w-full'>
                            <div>
                              <ErrorAnimation></ErrorAnimation>
                            </div>
                            <p className='text-xs sm:text-sm'>
                              {issue.comment}
                            </p>
                          </div>
                          {
                            issue.initialCode != '' &&
                          <CodeBlock
                            text={issue.initialCode}
                            language={issue.language}
                            showLineNumbers={true}
                            startingLineNumber={issue.lineNumber}
                            theme={atomOneDark}
                          />
                          }
                        </div>
                        <div className='flex gap-x-2 items-center w-full'>
                          <div>
                            <SuccessAnimation></SuccessAnimation>
                          </div>
                          <p className='text-xs sm:text-sm text-pretty'>
                            {issue.suggestion}
                          </p>
                        </div>
                        {
                          issue.solvingCode != '' &&
                        <CodeBlock
                          text={issue.solvingCode}
                          language={issue.language}
                          showLineNumbers={true}
                          startingLineNumber={issue.lineNumber}
                          theme={atomOneDark}
                        />
                        }
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

export default function Steps({ steps }: { steps: Step[] }) {

  // Sort the steps by time in descending order
  const sortedSteps = steps.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  // The first element is now the latest step
  const latestStep = sortedSteps[0];
  const connectingSteps = steps.filter(step => step.stepName === "connecting")
  const cloningSteps = steps.filter(step => step.stepName === "cloning")
  const identifyingSteps = steps.filter(step => step.stepName === "identifying")
  const reviewingSteps = steps.filter(step => step.stepName === "reviewing")



  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Repository Analysis</CardTitle>
        <CardDescription>Analyzing your GitHub repository to provide insights and recommendations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center text-primary-foreground">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Connecting</div>
              <p className="text-muted-foreground text-sm">Establishing a secure connection to your GitHub account.</p>
            </div>
            <div className="w-5 h-5 flex items-center justify-center text-primary-foreground">
              {
                (connectingSteps[0]?.status === "pending" || connectingSteps.length === 0)  && <PendingAnimation />
              }
              {
                connectingSteps[0]?.status === "error" && <ErrorAnimation />
              }
              {
                connectingSteps[0]?.status === "success" && <SuccessAnimation />
              }
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center text-primary-foreground">
              <GitCommitVerticalIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Cloning</div>
              <p className="text-muted-foreground text-sm">Cloning your repository to a local environment.</p>
            </div>
            <div className="w-5 h-5 flex items-center justify-center text-primary-foreground">
              {
                cloningSteps[0]?.status === "pending" && <PendingAnimation />
              }
              {
                cloningSteps[0]?.status === "error" && <ErrorAnimation />
              }
              {
                cloningSteps[0]?.status === "success" && <SuccessAnimation />
              }
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className='h-full'>
            <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center text-primary-foreground">
              <FileSearchIcon className="w-5 h-5" />
            </div>
            </div>
            <div className="flex-1">
              <div className="font-medium">Identifying Files</div>
              <p className="text-muted-foreground text-sm">Scanning your repository to identify relevant files.</p>

              {identifyingSteps.map((step, index) => (
                  renderStepContent(step)
                ))}
            </div>
            <div className="w-5 h-5 flex items-center justify-center text-primary-foreground">
              {
                identifyingSteps[0]?.status === "pending" && <PendingAnimation />
              }
              {
                identifyingSteps[0]?.status === "error" && <ErrorAnimation />
              }
              {
                identifyingSteps[0]?.status === "success" && <SuccessAnimation />
              }
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className='h-full'>
            <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center text-primary-foreground">
              <ClipboardListIcon className="w-5 h-5" />
            </div>
            </div>
            <div className="flex-1">
              <div className="font-medium">Reviewing</div>
              <p className="text-muted-foreground text-sm">Analyzing the identified files and generating insights.</p>
              {reviewingSteps.map((step, index) => (
                  renderStepContent(step)
                ))}
   
            </div>
            <div className="w-5 h-5 flex items-center justify-center text-primary-foreground">
              {
                identifyingSteps[0]?.status === "pending" && <PendingAnimation />
              }
              {
                identifyingSteps[0]?.status === "error" && <ErrorAnimation />
              }
              {
                identifyingSteps[0]?.status === "success" && <SuccessAnimation />
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}


function ClipboardListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  )
}


function FileSearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" />
      <path d="m9 18-1.5-1.5" />
      <circle cx="5" cy="14" r="3" />
    </svg>
  )
}


function GitCommitVerticalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v6" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 15v6" />
    </svg>
  )
}


function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}


function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}