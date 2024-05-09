import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { githubLogin } from '@/components/server/action'

export default async function PrivatePage() {

    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        // Login user if not logged in
        await githubLogin('/profile')
        redirect('/?error=unauthorized')
    }

  return <p>Hello {data.user.email}</p>
}