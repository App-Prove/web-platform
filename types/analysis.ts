type RepositoryScanData = {
    numberOfFiles: number;
    totalLineCount: number;
    mostCommonProgrammingLanguages: string[];
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
        language: string;
        lineNumber: number;
        initialCode: string;
        solvingCode: string;
        comment: string;
        suggestion: string;
        path: string;
    }[];
    path: string;
}[];


// Define the base interface
interface BaseStep {
    stepName:"connecting" | "cloning" | "identifying" | "reviewing";
    time: Date;
    status: "pending" | "analyzing" | "error" | "success";
    message: string;
    step: "connecting"|"cloning"|"dentifying"|"reviewing"
}
// Define specific interfaces for each variant
interface PendingAnalyzingErrorStep extends BaseStep {
    status: "pending" | "analyzing" | "error";
}

interface SuccessStep extends BaseStep {
    status: "success";
    type: "repositoryScan" | "relativeFiles" | "sensitiveFiles" | "inDepthAnalysis";
}

interface RepositoryScan extends SuccessStep {
    type: "repositoryScan";
    data: RepositoryScanData;
} 

interface RelativeFiles extends SuccessStep {
    type: "relativeFiles";
    data: RelativeFilesData;
}

interface SensitiveFilesStep extends SuccessStep {
    type: "sensitiveFiles";
    data: SensitiveFilesData;
}

interface InDepthAnalysisStep extends SuccessStep {
    type: "inDepthAnalysis";
    data: InDepthAnalysisData;
}

type Step = PendingAnalyzingErrorStep | RepositoryScan | RelativeFiles | SensitiveFilesStep | InDepthAnalysisStep;
