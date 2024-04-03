import { createClient } from "@/utils/supabase/server";

export default async function OfferPage({ params }: { params: { slug: string } }){
    // get id from slug
    const id = params.slug 
    const supabase = createClient();
    const {data,error} = await supabase.from('offers').select('*').eq('id', id);
    return (
        <div>
            <h1>Offer</h1>
            <p>{data && data[0]?.description}</p>
        </div>
    );
}