'use client'
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ErrorAnimation } from "@/components/LottieAnimations";
import { StepType } from "@/types/analysis";

export default function Step({ state }: { state: StepType }) {
    const [tempName, setTempName] = useState('');

    const animationSpeed = 0.1;
    const duration = `${Math.min(state.message.length, 35) * animationSpeed}s`;
    
    useEffect(() => {
        if (tempName !== state.message) {
            setTimeout(() => setTempName(state.message), 2400);
        }
    }, [state.message, tempName]);

    if (state == undefined) return null;

    const renderStepData = () => {
        if (state.status !== 'success' || !state.data) return null;

        switch (state.type) {
            case 'repositoryScan':
                return (
                    <div className="mt-2 text-sm text-gray-600">
                        <p>Files: {state.data.numberOfFiles}</p>
                        <p>Lines: {state.data.totalLineCount}</p>
                        <p>Languages: {state.data.mostCommonProgrammingLanguages.join(', ')}</p>
                    </div>
                );
            case 'relativeFiles':
                return (
                    <div className="mt-2 text-sm text-gray-600">
                        <p>Relevant files: {state.data.relativeFiles.length}</p>
                    </div>
                );
            case 'sensitiveFiles':
                return (
                    <div className="mt-2 text-sm text-gray-600">
                        <p>Sensitive files: {state.data.sensitiveFiles.length}</p>
                    </div>
                );
            case 'inDepthAnalysis':
                return (
                    <div className="mt-2 text-sm text-gray-600">
                        <p>Issues found: {state.data.reduce((acc, file) => acc + file.issues.length, 0)}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex items-start gap-x-2">
            <div className="w-12 h-12 relative flex items-center justify-center">
                <div
                    className={cn(
                        "rounded-full w-4 h-4 bg-gray-200",
                        state.status != 'pending' && "animate-fadeOut"
                    )}>
                </div>
                <div id="spinner" className={cn(
                    "absolute opacity-0 w-full h-full flex items-center justify-center",
                    state.status == 'error' && "animate-fadeIn",
                )}>
                    <ErrorAnimation></ErrorAnimation>
                </div>

                <div id="spinner" className={cn(
                    "absolute opacity-0 w-full h-full flex items-center justify-center",
                    state.status == 'inProgress' && "animate-fadeIn",
                    state.status == 'success' && "animate-fadeOut"
                )}>
                    <div
                        className="absolute w-4 h-4 border-2 rounded-full border-gray-200">
                    </div>
                    {[0, 0.05, 0.1, 0.15].map((delay, index) => (
                        <div
                            key={index}
                            style={{ borderColor: 'black transparent transparent transparent', animationDelay: `${delay}s` }}
                            className="absolute w-4 h-4 border-2 rounded-full animate-ring">
                        </div>
                    ))}
                </div>
                <div
                    key={state.status}
                    className={cn(
                        "w-4 h-4 absolute flex items-center justify-center rounded-full bg-[#DDF3ED] border-2 border-[#3EC78E] animate-borderDisappear",
                        state.status == 'success' ? "" : "hidden"
                    )}
                    >
                    <svg width="16" height="16" viewBox="0 0 16 16" overflow="visible">
                        <g filter="url(#filter0_d_714_530)">
                            <path
                                style={{
                                    fill: "none",
                                    stroke: "#3EC78E",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeDasharray: 9.93,
                                    strokeDashoffset: 9.93,
                                    strokeWidth:2,
                                }}
                                className="animate-draw" d="M5 8 L 8 10 L 10 4" />
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
            <div className="flex flex-col w-full min-h-[48px] relative">
                <div className="flex items-center relative">
                    <div
                        id="initial-step"
                        className={cn(
                            'absolute',
                            tempName != state.message ? "animate-slideOut" : "",
                        )}
                        key={`${state.status}-slideOut`}
                    >
                        <div
                            className={cn(
                                state.status == 'pending' && 'text-gray-300',
                            )}
                        >
                            <p className="font-light">
                                {tempName}
                            </p>
                        </div>
                    </div>
                    <div
                        id="next-step"
                        className={cn(
                            'absolute',
                            tempName != state.message ? "animate-slideIn" : "hidden",
                        )}
                        key={`${state.status}-slideIn`}
                    >
                        <div
                            key={state.message}
                            className={cn(
                                'text-gray-300',
                                state.status != 'pending' ? "bg-gradient-to-r from-black via-white to-black bg-200% bg-clip-text text-transparent animate-slideGradient" : ''
                            )}
                            style={{
                                animationDuration: duration,
                            }}
                        >
                            <p className="font-light">
                                {state.message}
                            </p>
                        </div>
                    </div>
                </div>
                {renderStepData()}
            </div>
        </div>
    )
}