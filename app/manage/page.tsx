import ManageTable from "@/components/Manage/table"
import Offer from "@/components/Offers/Offer"
import { formatOffers } from "@/lib/utils"

import { createClient } from "@/utils/supabase/server"

export default async function ManagePage() {
    // load offers for current user
    const supbase = createClient()
    // Check if user is logged in
    const { data: { user }, error: userError } = await supbase.auth.getUser()
    if (!user || userError) {
        return <div>Not logged in</div>
    }
    const { data, error } = await supbase.from('offers').select().eq('owner', user.id)
    const offers = formatOffers(data)

    return (
        <div className="flex flex-col gap-8 w-full">
            <h1>
                Manage Page
            </h1>
            <div className="flex flex-col gap-4 w-full">
            <ManageTable offerList={offers}></ManageTable>

            </div>
        </div>

    )
}