'use client'
import { useCallback, useState } from "react"
import { Button } from "./ui/button"
import { createClient } from "@/utils/supabase/clients"
import { revalidatePath } from "next/cache"
import { User } from "@supabase/supabase-js"

export function ParticipateButton({ user, participants, offerID }: { user: User, participants: string[], offerID: number }) {
    const [participating, setParticipating] = useState(false)
    const participate = useCallback(async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        // upload to db
        // Check if user exists
        if (!user) {
            console.log('User not found')
            return
        }
        if (participants) {
            participants.push(user?.id)
        }
        else {
            participants = [user?.id]
        }
        const { data: result, error } = await supabase.from('offers').update({ participants: participants }).eq('id', offerID).select()
        if (error) {
            console.log(error)
            return
        }
        setParticipating(true)
    }, []) // Add an empty array as the second argument
    const cancelParticipation = useCallback(async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        // upload to db
        // Check if user exists
        if (!user) {
            console.log('User not found')
            return
        }
        const index = participants.indexOf(user?.id)
        if (index > -1) {
            participants.splice(index, 1)
        }
        console.log(participants)
        const { data: result, error } = await supabase.from('offers').update({ participants: participants }).eq('id', offerID).select()
        if (error) {
            console.log(error)
            return
        }

        console.log('Cancelled participation')
        setParticipating(false)
    }
        , []) // Add an empty array as the second argument
    return (
        <>
            {participating ?
                <Button onClick={() => { cancelParticipation() }} variant={'secondary'}>Cancel participation</Button>
                :
                <Button onClick={() => { participate() }}>Participate</Button>
            }
        </>
    )
}
