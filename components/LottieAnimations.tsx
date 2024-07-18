
import Lottie from 'react-lottie';
import valid from '@/public/lottie/valid.json';
import error from '@/public/lottie/error.json';
import analyzing from '@/public/lottie/analyzing.json';
import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';

const defaultOptions = {
    autoplay: true,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};
export function SuccessAnimation() {
    return (
        <Lottie
            options={{ ...defaultOptions, animationData: valid, loop: false }}
            height={24}
            width={24}
        />
    )
}

export function ErrorAnimation() {
    return (
        <Lottie
            options={{ ...defaultOptions, animationData: error, loop: true }}
            height={24}
            width={24}
        />
    )
}

export function AnalyzingAnimation() {
    return (
        <Lottie
            options={{ ...defaultOptions, animationData: analyzing, loop: true }}
            height={24}
            width={24}
        />
    )
}

export function PendingAnimation() {
    return (
        <div className='flex gap-x-1 items-center'>
            <span className='w-2 h-2 rounded-full bg-orange animate-pulse'></span>
            <span className='w-2 h-2 rounded-full bg-orange animate-pulse'></span>
            <span className='w-2 h-2 rounded-full bg-orange animate-pulse'></span>
        </div>
    )
}


export function LoadingAnimation(){
    return (
        <Loader2Icon className={'animate-spin'}></Loader2Icon>
    )
}