'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import React, { useRef } from 'react'
import ProfileSettings from '@/components/Profile/ProfileSettings'

export default async function PrivatePage() {

    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        // Login user if not logged in
        redirect('/?error=unauthorized')
    }
    const user = data.user
    const keywords = [{ value: 'python', label: 'python' }, { value: 'javascript', label: 'javascript' }] as Keyword[];
    return (
        <div className='w-full'>
            <p>{user.user_metadata.name}</p>
            <p>
                Here you can set up your profile
            </p>
            <ProfileSettings keywords={keywords} />
        </div>
    )
}