'use client'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function OffersPagniation({ page, numberOfOffer, filteredOffers }: { page: number, numberOfOffer: number, filteredOffers: Offer[] }) {
    const pathname = usePathname();
    const { replace } = useRouter();
    const searchParams = useSearchParams();
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious onClick={(e) => {
                                    if(page == 1) return;
                                    const params = new URLSearchParams(searchParams);
                                    params.set('page', (page - 1).toString());
                                    replace(`${pathname}?${params.toString()}`);
                                }}  />
                </PaginationItem>
                {Array.from({ length: Number((filteredOffers.length / numberOfOffer).toPrecision(1)) }).map((_, i) => {
                    // Display only two previous numbers and two last numbers
                    // depending on the current page
                    // with ellipsis in between
                        if(i < 2 || i > (Number((filteredOffers.length / numberOfOffer).toPrecision(1)) - 3) || (i >= page - 2 && i <= page + 2)){
                        return (
                            <PaginationItem key={i}>
                                <PaginationLink onClick={(e) => {
                                    const params = new URLSearchParams(searchParams);
                                    params.set('page', (i + 1).toString());
                                    replace(`${pathname}?${params.toString()}`);
                                }}
                                >{i + 1}</PaginationLink>
                            </PaginationItem>
                        )
                    } 
                else if(i == 2 || i == (Number((filteredOffers.length / numberOfOffer).toPrecision(1)) - 3)){
                        return (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )
                }
                })}
                <PaginationItem>
                    <PaginationNext onClick={(e) => {
                        if(page >= Number((filteredOffers.length / numberOfOffer).toPrecision(1))) return;
                                    const params = new URLSearchParams(searchParams);
                                    params.set('page', (page + 1).toString());
                                    replace(`${pathname}?${params.toString()}`);
                                }} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}