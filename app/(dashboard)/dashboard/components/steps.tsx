'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocalStorage } from "@/lib/localStorage"
import React, { useCallback, useState } from "react"
import Step from "./step"
import { StepType, RepositoryScanStep, RelativeFilesStep, SensitiveFilesStep, InDepthAnalysisStep } from "@/types/analysis"
import { Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import SummaryCards from "./summary-cards"
import IssuesList from "./issues-list"
import { Issue } from "@/types/analysis"

export default function Steps() {
  const [auditType] = useLocalStorage('auditType', '')
  const [url] = useLocalStorage('url', '')
  const [steps, setSteps] = useState<StepType[]>([
    { stepName: "connecting", progress: 0, message: "Connecting", status: 'pending', time: new Date() },
    { stepName: "cloning", progress: 0, message: "Cloning repository", status: 'pending', time: new Date() },
    { stepName: "identifying", progress: 0, message: "Identifying relevant files", status: 'pending', time: new Date() },
    { stepName: "reviewing", progress: 0, message: "Analyzing code", status: 'pending', time: new Date() },
  ])

  const [analysisResults, setAnalysisResults] = useState<any>(null) // New state for analysis results
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)

  const simulateGitHubAnalysis = useCallback(() => {
    setStarted(true)
    let currentStep = 0
    const updateStep = (index: number, stepData: Partial<StepType>) => {
      setSteps((prevSteps: StepType[]) => prevSteps.map((step, i) => 
        i === index ? { ...step, ...stepData } as StepType : step
      ))
    }

    const simulateStepProgress = () => {
      if (currentStep >= steps.length) {
        setFinished(true)
        return
      }

      updateStep(currentStep, { status: 'inProgress', progress: 0 })

      let progress = 0
      const intervalId = setInterval(() => {
        progress += 10
        updateStep(currentStep, { progress })

        if (progress >= 100) {
          clearInterval(intervalId)
          const stepData = getStepData(currentStep)
          updateStep(currentStep, { ...stepData, status: 'success', progress: 100 } as StepType)
          currentStep++
          setTimeout(simulateStepProgress, 1000)
        }
      }, 200)
    }

    simulateStepProgress()
  }, [steps.length])

  const simulateRepositoryAnalysis = useCallback(() => {
    setStarted(true)
    let currentStep = 2
    const updateStep = (index: number, stepData: Partial<StepType>) => {
      setSteps((prevSteps: StepType[]) => prevSteps.map((step, i) => 
        i === index ? { ...step, ...stepData } as StepType : step
      ))
    }

    const simulateStepProgress = () => {
      if (currentStep >= steps.length) {
        setFinished(true)
        return
      }

      updateStep(currentStep, { status: 'inProgress', progress: 0 })

      let progress = 0
      const intervalId = setInterval(() => {
        progress += 10
        updateStep(currentStep, { progress })

        if (progress >= 100) {
          clearInterval(intervalId)
          const stepData = getStepData(currentStep)
          updateStep(currentStep, { ...stepData, status: 'success', progress: 100 } as StepType)
          currentStep++
          setTimeout(simulateStepProgress, 1000)
        }
      }, 200)
    }

    simulateStepProgress()
  }, [steps.length])

  const getStepData = (stepIndex: number): Partial<StepType> => {
    switch (stepIndex) {
      case 0:
        return {
          message: "Connected successfully",
          type: "repositoryScan",
          data: {
            numberOfFiles: 150,
            totalLineCount: 15000,
            mostCommonProgrammingLanguages: ["JavaScript", "TypeScript", "Python"]
          }
        } as RepositoryScanStep
      case 1:
        return {
          message: "Repository cloned",
          type: "relativeFiles",
          data: {
            relativeFiles: [
              { path: "/src/index.js", language: "JavaScript" },
              { path: "/src/components/App.tsx", language: "TypeScript" },
              { path: "/scripts/analyze.py", language: "Python" }
            ]
          }
        } as RelativeFilesStep
      case 2:
        const sensitiveFilesData = {
          message: "Relevant files identified",
          type: "sensitiveFiles",
          data: {
            sensitiveFiles: [
              { path: "/config/secrets.json", language: "JSON" },
              { path: "/src/utils/auth.js", language: "JavaScript" }
            ]
          }
        } as SensitiveFilesStep;
        setAnalysisResults((prev: any) => ({ ...prev, sensitiveFiles: sensitiveFilesData.data.sensitiveFiles }));
        return sensitiveFilesData;
      case 3:
        const inDepthAnalysisData: InDepthAnalysisStep = {
          stepName: "reviewing",
          time: new Date(),
          status: "success",
          message: "Code analysis completed",
          type: "inDepthAnalysis",
          data: [{
            issues: [
              // Security Issue
              {
                id: 1,
                category: "Security",
                title: "Unvalidated user input",
                severity: "High",
                language: "JavaScript",
                lineNumber: 42,
                file: "/src/controllers/userController.js",
                initialCode: "const userInput = req.params.id;",
                solvingCode: "const userInput = sanitizeInput(req.params.id);",
                comment: "Potential security vulnerability: Unvalidated user input",
                suggestion: "Sanitize user input before use to prevent injection attacks"
              },
              // Performance Issues
              {
                id: 2,
                category: "Performance",
                title: "Inefficient loop",
                severity: "Medium",
                language: "JavaScript",
                lineNumber: 15,
                file: "/src/utils/performance.js",
                initialCode: "for (let i = 0; i < arr.length; i++) { /* ... */ }",
                solvingCode: "arr.forEach(item => { /* ... */ });",
                comment: "Consider using forEach for better readability.",
                suggestion: "Use forEach instead of a traditional for loop."
              },
              {
                id: 3,
                category: "Performance",
                title: "Redundant calculations",
                severity: "Medium",
                language: "JavaScript",
                lineNumber: 30,
                file: "/src/utils/calculations.js",
                initialCode: "const result = expensiveFunction();",
                solvingCode: "const memoizedResult = memoize(expensiveFunction);",
                comment: "Cache results to avoid redundant calculations.",
                suggestion: "Implement memoization for expensive calculations."
              },
              {
                id: 4,
                category: "Performance",
                title: "Excessive DOM manipulation",
                severity: "Low",
                language: "JavaScript",
                lineNumber: 22,
                file: "/src/components/Component.js",
                initialCode: "document.getElementById('myElement').innerHTML = 'Hello';",
                solvingCode: "setState({ myElement: 'Hello' });",
                comment: "Minimize direct DOM manipulation.",
                suggestion: "Use React state to manage DOM updates."
              },
              // Best Practices Issues
              {
                id: 5,
                category: "Best Practices",
                title: "Missing prop types",
                severity: "Low",
                language: "JavaScript",
                lineNumber: 10,
                file: "/src/components/MyComponent.js",
                initialCode: "function MyComponent(props) { /* ... */ }",
                solvingCode: "MyComponent.propTypes = { /* ... */ };",
                comment: "Define prop types for better type checking.",
                suggestion: "Use PropTypes to define expected props."
              },
              {
                id: 6,
                category: "Best Practices",
                title: "Unused variable",
                severity: "Low",
                language: "JavaScript",
                lineNumber: 5,
                file: "/src/utils/helpers.js",
                initialCode: "const unusedVar = 'I am not used';",
                solvingCode: "// Remove unused variable",
                comment: "Remove variables that are not used.",
                suggestion: "Eliminate unused variables to clean up the code."
              }
            ],
            path: "/src/controllers/userController.js"
          }]
        } as InDepthAnalysisStep;
        setAnalysisResults((prev: any) => ({ ...prev, issues: inDepthAnalysisData.data[0].issues }));
        return inDepthAnalysisData;
      default:
        return {}
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    // Handle the dropped files here
    console.log(files)
  }

  // Calculate counts for summary cards
  const securityIssuesCount = analysisResults?.issues?.filter((issue: Issue) => issue.category === "Security").length || 0;
  const performanceIssuesCount = analysisResults?.issues?.filter((issue: Issue) => issue.category === "Performance").length || 0;
  const bestPracticesCount = analysisResults?.issues?.filter((issue: Issue) => issue.category === "Best Practices").length || 0;

  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle>Code Analysis</CardTitle>
        <CardDescription>Analyzing your repository with care</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Repository Connection</h3>
            <Tabs defaultValue="github" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="github">GitHub</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="github" className="mt-8 flex flex-col gap-4">
                <div className="flex gap-4">
                  <Input placeholder="Enter your GitHub repository URL" />
                  <Button onClick={simulateGitHubAnalysis}>Connect</Button>
                </div>
                {steps.slice(0, 2).map((step, index) => (
                  <Step key={index} state={step} />
                ))}
              </TabsContent>
              <TabsContent value="upload">
                <div 
                  className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Drag and drop your repository files here, or click to select files</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={simulateRepositoryAnalysis}>Start Analysis</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">File Analysis</h3>
            {steps.slice(2).map((step, index) => (
              <Step key={index + 2} state={step} />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4 overflow-hidden">
        <Separator />
        <SummaryCards data={{ totalIssues: analysisResults?.issues?.length || 0, categories: { security: securityIssuesCount, performance: performanceIssuesCount, bestPractices: bestPracticesCount }, issues: analysisResults?.issues || [] }} />
        <IssuesList issues={analysisResults?.issues || []} />
      </CardFooter>
    </Card>
  )
}