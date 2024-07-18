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