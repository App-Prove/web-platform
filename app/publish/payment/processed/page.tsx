import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { CheckoutForm, Return } from '@/components/Publish/Checkout'

export default async function PrivatePage() {

    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        // redirect('/?error=unauthorized')
    }


    return (
        <div className='flex-1 flex flex-col'>
            <div className='flex-1'>
            <h1>Payment processed</h1>
           <Return></Return> 
            </div>
        </div>
    )
}