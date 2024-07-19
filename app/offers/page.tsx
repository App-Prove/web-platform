'use server'
import OffersSearch from "@/components/Offers/OffersSearch";
import Offer from "@/components/Offers/Offer";
import { createClient } from "@/utils/supabase/server";
import OffersPagniation from "@/components/Offers/OffersPagination";
import { formatOffers } from "@/lib/utils";


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

  //TODO: prevent offer from being fetched each time the page is rendered
  //TODO: put offers in context
  // get offers from db here
  const supabase = createClient();
  const { data, error } = await supabase.from('offers').select('*').eq('payment_status', 'complete');
  if (error) return
  // combine offers from db and offers from the array
  const offers: Offer[] = formatOffers(data);

  const numberOfOffer = 10
  var filteredOffers = offers.filter(offer => offer.description.toLowerCase().includes(query.toLowerCase()) || offer.url.toLowerCase().includes(query.toLowerCase()));

  //TODO: Add all logic in here
  return (
    <div className="flex-1 flex flex-col gap-4">
      <OffersSearch></OffersSearch>
      <div className="flex-1 flex flex-col gap-4">
        {
          filteredOffers.map((offer, index) => {
              if(index >= (currentPage - 1) * numberOfOffer && index < currentPage * numberOfOffer){
              return <Offer offer={offer} key={index}></Offer>
            }
          }
          )}
      </div>
      <div className="mb-4">
      <OffersPagniation page={currentPage} numberOfOffer={numberOfOffer} filteredOffers={filteredOffers} ></OffersPagniation>
      </div>

    </div>
  );
}
