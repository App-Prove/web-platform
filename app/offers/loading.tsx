import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="w-full flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => {
                return(
            <Skeleton className="w-full h-40" key={i}>
            </Skeleton>
                )
            })}
        </div>
    )
}