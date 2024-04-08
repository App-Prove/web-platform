import * as React from "react"

import { redirect } from 'next/navigation'
import PublishForm from "@/components/publish-form"
import { createClient } from "@/utils/supabase/server"
import { CheckoutForm } from "@/components/checkout"



export default async function PrivatePage() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/?error=unauthorized')
    }
    const { data: keywordList } = await supabase.from('keywords').select('*')
    const keywords: Keyword[] = keywordList?.map((keyword) => {
        return {
            value: keyword.label.toLowerCase(),
            label: keyword.label,
        }
    }) || [];

    return (
        <div className='h-full w-full mx-auto flex flex-col gap-4 mb-16 overflow-visible'>
            <PublishForm keywords={keywords}></PublishForm>
        </div>
    )
}
