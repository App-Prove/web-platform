'use client'
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
export default function ReviewingStep({
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
    // const [tempName, setTempName] = useState('');

    // const animationSpeed = 0.1;
    // // Calculate duration based on the length of the current displayed word
    // const duration = `${state.message.length* animationSpeed}s`;
    // useEffect(() => {
    //     if (tempName !== state.message) {
    //         setTimeout(() => setTempName(state.message), 2400);
    //     }
    // }, [state.message, tempName]);

    return (
        <div className="flex items-center gap-x-2 py-2">
            <div id="icon" className="p-2 relative flex items-center justify-center bg-white rounded-lg shadow-lg border from-gray-50 to-gray-100 bg-gradient-to-t">
                <div
                    className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-full bg-[#3FB996] border-2 border-[#3EC78E] animate-borderDisappear",
                        inDepthAnalysisState?.status == 'success' ? "" : "hidden"
                        
                    )}
                    >
                    <svg width="16" height="16" viewBox="0 0 16 16" overflow="visible">
                        <g filter="url(#filter0_d_714_530)">
                            <path
                                style={{
                                    fill: "none",
                                    stroke: "white",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeDasharray: 9.93,
                                    strokeDashoffset: 9.93,
                                    strokeWidth:2,
                                }}
                                className="animate-draw scale-150 origin-center" d="M5 8 L 8 10 L 10 4" />
                        </g>
                        <defs>
                            <filter id="filter0_d_714_530" width="100%" height="150%" filterUnits="userSpaceOnUse"
                                 colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                    result="hardAlpha" />
                                <feOffset dy="1" />
                                <feGaussianBlur stdDeviation="1" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="dropshadow" />
                                <feBlend mode="normal" in="SourceGraphic" in2="dropshadow" result="shape" />
                            </filter>
                        </defs>
                    </svg>
                </div>
            </div>
            <div>
                <h2 className="text-sm sm:text-base">{inDepthAnalysisState && inDepthAnalysisState.message}</h2>
                <p className="text-muted-foreground text-xs sm:text-sm">
                    {inDepthAnalysisState && inDepthAnalysisState.data.length} file{(inDepthAnalysisState && inDepthAnalysisState.data.length > 0) && 's'} identified as sensitive out of {relativeFilesState?.data.relativeFiles.length} file{(relativeFilesState && relativeFilesState.data.relativeFiles.length > 0) && 's'} relative to project.
                </p>
            </div>



        </div>
    )
}