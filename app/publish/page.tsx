"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { redirect } from 'next/navigation'
import { createClient } from "@/utils/supabase/clients"
import PublishForm from "@/components/publish-form"
import { Toaster } from "@/components/ui/toaster"



export default function PrivatePage() {
    // const supabase = createClient()

    // const { data, error } = await supabase.auth.getUser()
    // if (error || !data?.user) {
    //     redirect('/login')
    // }


    return (
        <div className='h-full w-full mx-auto flex flex-col gap-4 mb-16'>
            <h1>
                Offer
            </h1>
            <PublishForm></PublishForm>
        </div>
    )
}
