'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import React, { useRef } from 'react'
import ProfileSettings from '@/components/Profile/ProfileSettings'
import Component from '@/components/Profile/Portal'
import { Toaster } from 'sonner'

export default async function PrivatePage() {

    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        // Login user if not logged in
        redirect('/?error=unauthorized')
    }
    const user = data.user
    // Get user data based on the user id
    const { data: profilesData, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id)
    const keywords = [{ value: 'python', label: 'python' }, { value: 'javascript', label: 'javascript' }] as Keyword[];
    const profileData = profilesData?.length===1 ? profilesData[0]:null
    return (
        <div className='w-full'>
            <Component user={user} profileData={profileData}></Component>
            <Toaster></Toaster>
        </div>
    )
}