'use client'
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function OffersSearch() {
    const pathname = usePathname();
    const { replace } = useRouter();
    const searchParams = useSearchParams();
    const handleSearch = useDebouncedCallback((term: string) =>{
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    },300)

    return (
        <div className="flex gap-4">
            <form className="flex-1 flex-shrink-0 w-full">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by keyword"
                        className="w-full appearance-none bg-background pl-8 shadow-none "
                        onChange={(e) => {
                            handleSearch(e.target.value);
                        }}
                        defaultValue={searchParams.get('query')?.toString()}
                    />
                </div>
            </form>
        </div>

    )
}