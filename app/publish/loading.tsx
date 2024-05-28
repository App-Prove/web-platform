
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="w-full flex flex-col gap-4">
            <Skeleton className="w-full h-12" />
            <Separator></Separator>
            <Label>Short description</Label>
            <Skeleton className="w-full h-24" />
            <Separator></Separator>
            <Label>Audit type</Label>
            <div className="flex gap-x-2">
            <Skeleton className="w-full h-24" />
            <Skeleton className="w-full h-24" />
            </div>
            <Separator></Separator>
            <Label>Audit period</Label>
            <Skeleton className="w-full h-12" />
            <Separator></Separator>
            <Label>Keyword</Label>
            <Skeleton className="w-full h-12" />
            <Separator></Separator>
        </div>
    )
}
