import OffersSearch from "@/components/offers-search";
import Offers from "@/components/offers";
import OffersSkeleton from "@/components/offers-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";

export default async function OffersPage({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
    };
  }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const offers: Offer[] = [];

    // get offers from db here
    const supabase = createClient();
    const { data, error } = await supabase.from('offers').select('*').eq('payment_status', 'complete');
    // combine offers from db and offers from the array
    offers.push(...(data as any[])?.map(offer => ({
        id: offer.id,
        url: offer.url,
        badges: offer.keywords.split(','),
        description: offer.description,
        budget: offer.budget,
        from: offer.from,
        to: offer.to,
        participants: offer.participants,
    })))

    var filteredOffers = offers.filter(offer => offer.url.includes(query));

    return (
        <div className="flex-1 flex flex-col gap-4">
            <OffersSearch></OffersSearch>
            <Suspense key={query + currentPage} fallback={
                <OffersSkeleton/>
            }
            >
            <Offers offers={filteredOffers}></Offers>
      </Suspense>
        </div>
    );
}
