import * as React from "react"
import { redirect } from 'next/navigation'
import PublishForm from "@/components/Publish/Form"
import { createClient } from "@/utils/supabase/server"
import { Toaster } from "@/components/ui/sonner"

export default async function PrivatePage() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        // redirect('/?error=unauthorized')
    }
    return (
        <div className='h-full w-full mx-auto flex flex-col gap-4 mb-16 overflow-visible'>
            <PublishForm user={data?.user}></PublishForm>
            <Toaster></Toaster>
        </div>
    )
}
