export type RepositoryScanData = {
    numberOfFiles: number;
    totalLineCount: number;
    mostCommonProgrammingLanguages: string[];
};

export type RelativeFilesData = {
    relativeFiles: {
        path: string;
        language: string;
    }[]
};

export type SensitiveFilesData = {
    sensitiveFiles: {
        path: string;
        language: string;
    }[]; // Contains file paths
};


export interface Issue {
    id: number; // Added id property
    category: "Security" | "Performance" | "Best Practices"; // Added category property
    title: string; // Added title property
    severity: "High" | "Medium" | "Low"; // Added severity property
    language: string;
    lineNumber: number; // Updated from 'line' to 'lineNumber'
    file: string; // Updated from 'path' to 'file'
    initialCode: string;
    solvingCode: string;
    comment: string;
    suggestion: string;
  }

export type InDepthAnalysisData = {
    issues: Issue[];
    path: string; // Ensure this is included in the outer structure
}[];

// Define the base interface
interface BaseStep {
    stepName:"connecting" | "cloning" | "identifying" | "reviewing";
    time: Date;
    status: "pending" | "inProgress" | "error" | "success";
    message: string;
    progress?: number; 
    type?: string;
}
// Define specific interfaces for each variant
export interface PendingErrorStep extends BaseStep {
    status: "pending" | "inProgress" | "error";
}

export interface SuccessStep extends BaseStep {
    status: "success";
    type: "repositoryScan" | "relativeFiles" | "sensitiveFiles" | "inDepthAnalysis";
}

export interface RepositoryScanStep extends SuccessStep {
    type: "repositoryScan";
    data: RepositoryScanData;
} 

export interface RelativeFilesStep extends SuccessStep {
    type: "relativeFiles";
    data: RelativeFilesData;
}

export interface SensitiveFilesStep extends SuccessStep {
    type: "sensitiveFiles";
    data: SensitiveFilesData;
}

export interface InDepthAnalysisStep extends SuccessStep {
    type: "inDepthAnalysis";
    data: InDepthAnalysisData;
}

export type StepType = PendingErrorStep | RepositoryScanStep | RelativeFilesStep | SensitiveFilesStep | InDepthAnalysisStep;

export interface DashboardData {
  totalIssues: number
  categories: {
    security: number
    performance: number
    bestPractices: number
  }
  issues: Issue[]
}
