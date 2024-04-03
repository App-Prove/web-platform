import * as React from "react"

import { redirect } from 'next/navigation'
import PublishForm from "@/components/publish-form"
import { createClient } from "@/utils/supabase/server"



export default async function PrivatePage() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        console.log(data)
        redirect('/login')
    }

    return (
        <div className='h-full w-full mx-auto flex flex-col gap-4 mb-16'>
            <h1>
                Offer details
            </h1>
            <PublishForm></PublishForm>
        </div>
    )
}
