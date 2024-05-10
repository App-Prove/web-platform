import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Label } from '@radix-ui/react-dropdown-menu'
import { CommandShortcut } from '@/components/ui/command'
import { CommandList, CommandEmpty, CommandGroup, CommandItem } from 'cmdk'
import { Command, Badge, X } from 'lucide-react'
import { toast } from 'sonner'
import { publishNewKeyword } from '../publish/actions'
import React, { useRef } from 'react'
import ProfileSettings from '@/components/profile-settings'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function PrivatePage() {

    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        // Login user if not logged in
        redirect('/?error=unauthorized')
    }
    const user = data.user
    console.log(user)
    const keywords = [{ value: 'python', label: 'python' }, { value: 'javascript', label: 'javascript' }] as Keyword[];
    return (
        <div className='w-full'>
            <p>Hello {user.user_metadata.name}</p>
            <p>
                Here you can set up your profile
            </p>
            <ProfileSettings keywords={keywords}/>

        </div>
    )
}