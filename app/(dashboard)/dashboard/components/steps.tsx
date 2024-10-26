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
import FileTree from "./file-tree"
import { useFiles, FileTreeItem } from "../context/files-context"

// Define constants for mock analysis data
const MOCK_ANALYSIS_DATA = {
  issues: [
    {
      id: 1,
      category: "Security" as const,
      title: "Unvalidated user input",
      severity: "High",
      language: "JavaScript",
      lineNumber: 5,
      file: "/src/controllers/userController.js",
      initialCode: `
const express = require('express');
const router = express.Router();

router.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  // Potential SQL injection vulnerability
  const query = \`SELECT * FROM users WHERE id = \${userId}\`;
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

module.exports = router;
      `,
      solvingCode: `
const express = require('express');
const router = express.Router();

router.get('/user/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  // Use parameterized query to prevent SQL injection
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

module.exports = router;
      `,
      comment: "Potential security vulnerability: Unvalidated user input leading to SQL injection",
      suggestion: "Use parameterized queries and validate user input to prevent SQL injection attacks"
    },
    {
      id: 2,
      category: "Performance" as const,
      title: "Inefficient loop",
      severity: "Medium",
      language: "JavaScript",
      lineNumber: 2,
      file: "/src/utils/performance.js",
      initialCode: `
function processLargeArray(arr) {
  const results = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] % 2 === 0) {
      results.push(arr[i] * 2);
    }
  }
  return results;
}
      `,
      solvingCode: `
function processLargeArray(arr) {
  return arr.filter(num => num % 2 === 0).map(num => num * 2);
}
      `,
      comment: "Inefficient loop for array processing",
      suggestion: "Use functional methods like filter and map for better performance and readability"
    },
    // New issue added here
    {
      id: 3,
      category: "Best Practices" as const,
      title: "Inconsistent function naming",
      severity: "Low",
      language: "JavaScript",
      lineNumber: 1,
      file: "/src/utils/performance.js",
      initialCode: `
function processLargeArray(arr) {
  // ... (existing code)
}

function Process_small_array(arr) {
  // ... (some code)
}
      `,
      solvingCode: `
function processLargeArray(arr) {
  // ... (existing code)
}

function processSmallArray(arr) {
  // ... (some code)
}
      `,
      comment: "Inconsistent function naming convention",
      suggestion: "Use camelCase for all function names to maintain consistency"
    },
  ] as Issue[]
};

const FILE_TREE: FileTreeItem = {
  name: 'root',
  type: 'folder',
  children: [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'controllers',
          type: 'folder',
          children: [
            {
              name: 'userController.js',
              type: 'file',
            }
          ]
        },
        {
          name: 'utils',
          type: 'folder',
          children: [
            {
              name: 'performance.js',
              type: 'file',
            }
          ]
        },
      ]
    },
  ]
};

// Function to populate file tree with issues
function populateFileTreeWithIssues(tree: FileTreeItem, issues: Issue[]): FileTreeItem {
  if (tree.type === 'file') {
    const fileIssues = issues.filter(issue => issue.file.endsWith(`/${tree.name}`));
    if (fileIssues.length > 0) {
      return {
        ...tree,
        hasError: true,
        errors: fileIssues.map(issue => ({
          category: issue.category,
          title: issue.title,
          lineNumber: issue.lineNumber,
          actualCode: issue.initialCode,
          newCode: issue.solvingCode,
          hint: issue.suggestion
        }))
      };
    }
  } else if (tree.type === 'folder' && tree.children) {
    return {
      ...tree,
      children: tree.children.map(child => populateFileTreeWithIssues(child, issues))
    };
  }
  return tree;
}

export default function Steps() {
  const [auditType] = useLocalStorage('auditType', '')
  const [url] = useLocalStorage('url', '')
  const { setFileTree, setIsLoading } = useFiles()
  const [steps, setSteps] = useState<StepType[]>([
    { stepName: "connecting", progress: 0, message: "Waiting for connection", status: 'pending', time: new Date() },
    { stepName: "cloning", progress: 0, message: "Waiting for repository cloning", status: 'pending', time: new Date() },
    { stepName: "identifying", progress: 0, message: "Waiting for relevant files identification", status: 'pending', time: new Date() },
    { stepName: "reviewing", progress: 0, message: "Waiting for code analysis", status: 'pending', time: new Date() },
  ])

  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [activeTab, setActiveTab] = useState('github')

  const simulateGitHubAnalysis = useCallback(() => {
    setStarted(true)
    setIsLoading(true)
    let currentStep = 0
    const updateStep = (index: number, stepData: Partial<StepType>) => {
      setSteps((prevSteps: StepType[]) => prevSteps.map((step, i) => 
        i === index ? { ...step, ...stepData } as StepType : step
      ))
    }

    const simulateStepProgress = () => {
      if (currentStep >= steps.length) {
        setFinished(true)
        setIsLoading(false)
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
  }, [steps.length, setIsLoading])

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
            issues: MOCK_ANALYSIS_DATA.issues,
            path: "/src/utils/performance.js"
          }]
        } as InDepthAnalysisStep;
        setAnalysisResults((prev: any) => ({ ...prev, issues: MOCK_ANALYSIS_DATA.issues }));

        // Populate file tree with issues and update it
        const populatedFileTree = populateFileTreeWithIssues(FILE_TREE, MOCK_ANALYSIS_DATA.issues);
        console.log('Populated File Tree:', JSON.stringify(populatedFileTree, null, 2));
        setFileTree(populatedFileTree);
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
            <Tabs defaultValue="github" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="github">GitHub</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="github" className="mt-8 flex flex-col gap-4">
                <div className="flex gap-4">
                  <Input placeholder="Enter your GitHub repository URL" />
                  <Button onClick={simulateGitHubAnalysis}>Connect</Button>
                </div>
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
            <div className="flex gap-4">
              <div className="flex flex-col gap-4 w-full">
                {activeTab === 'github'
                  ? steps.map((step, index) => (
                      <Step key={index} state={step} />
                    ))
                  : steps.slice(2).map((step, index) => (
                      <Step key={index + 2} state={step} />
                    ))}
              </div>
            </div>
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
