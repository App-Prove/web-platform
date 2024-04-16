import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const dynamic = 'force-dynamic'

export default function Layout(
{
  children,
}: Readonly<{
  children: React.ReactNode;
}>
) {

    return (
        <div className="flex gap-6 flex-col w-full">
            <div className="flex gap-4">
                <form className="flex-1 flex-shrink-0 w-full">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by keyword"
                            className="w-full appearance-none bg-background pl-8 shadow-none "
                        />
                    </div>
                </form>
            </div>
            {children}
        </div>
    )
}
