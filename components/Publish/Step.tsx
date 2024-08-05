'use client'
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ErrorAnimation } from "../LottieAnimations";
export default function Step({ state }: { state: Step }) {
    const [tempName, setTempName] = useState('');

    const animationSpeed = 0.1;
    // Calculate duration based on the length of the current displayed word
    const duration = `${Math.min(state.message.length,35)* animationSpeed}s`;
    useEffect(() => {
        if (tempName !== state.message) {
            setTimeout(() => setTempName(state.message), 2400);
        }
    }, [state.message, tempName]);

    if (state == undefined) return null;
    return (
        <div className="flex items-center gap-x-2">
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
                    <div
                        style={{ borderColor: 'black transparent transparent transparent' }}
                        className="absolute w-4 h-4 border-2 rounded-full animate-ring ">
                    </div>
                    <div
                        style={{ borderColor: 'black transparent transparent transparent', animationDelay: '0.05s' }}
                        className="absolute w-4 h-4 border-2 rounded-full animate-ring ">
                    </div>
                    <div
                        style={{ borderColor: 'black transparent transparent transparent', animationDelay: '0.1s' }}
                        className="absolute w-4 h-4 border-2 rounded-full animate-ring ">
                    </div>
                    <div
                        style={{ borderColor: 'black transparent transparent transparent', animationDelay: '0.15s' }}
                        className="absolute w-4 h-4 border-2 rounded-full animate-ring ">
                    </div>
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
            <div className="flex w-full min-h-[48] relative items-center max-w-full overflow-visible flex-grow-0">
                <div
                    id="initial-step"
                    className={cn(
                        'aboslute',
                        tempName != state.message ? "animate-slideOut" : "",
                    )}
                    key={`${state.status}-slideOut`}
                >
                    <div
                        className={cn(
                            state.status == 'pending' && 'text-gray-300 ',
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
        </div>
    )
}