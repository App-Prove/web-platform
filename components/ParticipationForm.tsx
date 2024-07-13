'use client'
import { useCallback, useState } from "react"
import { Button } from "./ui/button"
import { createClient } from "@/utils/supabase/clients"
import { User } from "@supabase/supabase-js"
import { Toast } from "./ui/toast"
import { toast } from "sonner"
import { Toaster } from "./ui/sonner"
import { Input } from "./ui/input"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { set } from "date-fns"

const FormSchema = z.object({
    prURL: z.string().url({
        message: "Please provide a valid URL.",
    })
})

export function ParticipationForm({ user, participating, offerID, prURL }: { user: User, participating: boolean, offerID: number, prURL: string }) {
    const [participationRegistered, setParticipationRegistered] = useState(participating)
    const [submittingPR, setSubmittingPR] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            prURL: prURL??'',
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setSubmittingPR(true)
        const supabase = createClient()
        // upload to db
        // Check if user exists
        const {data: {user: userData}, error:userError} = await supabase.auth.getUser()
        if (!userData || userError) {
            toast('User not found please log in')
            return
        }
  
        const { data: result, error } = await supabase
            .from('participants')
            .update({ 'pr_url': data.prURL })
            .eq('offer_id', offerID)
            .eq('participant_id', user.id)
            .select()
        if (error || result.length === 0) {
            toast('Error submitting PR URL')
            return
        }
        toast('PR URL submitted')
        setSubmittingPR(false)
    }
    const participate = useCallback(async () => {
        console.log('participate')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        // upload to db
        // Check if user exists
        if (!user) {
            toast('User not found please log in')
            return
        }
        const { data: result, error } = await supabase
            .from('participants')
            .upsert({ offer_id: offerID, participant_id: user.id })
            .select()
        if (error) {
            console.log(error)
            return
        }
        setParticipationRegistered(true)
        toast('Participation registered')
    }, [participationRegistered])


    const cancelParticipation = useCallback(
        async () => {
            // Client side
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            // upload to db
            // Check if user exists
            if (!user) {
                toast('User not found please log in')
                return
            }

            const { data: result, error } = await supabase.from('participants').delete().eq('offer_id', offerID).eq('participant_id', user.id).select()

            if (error) {
                console.log(error)
                return
            }
            setParticipationRegistered(false)
            toast('Cancelled participation')
        }, [participationRegistered])
    return (
        <div className="flex sm:flex-col">
            {(participationRegistered) ?
                <>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="prURL"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pull Request URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Put your pull request URL" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Put your pull request URL from github once you have submitted your PR.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">{!submittingPR?"Submit":"Submitting your PR..."}</Button>
                            </form>
                        </Form>
                    </div>
                    <Button
                        onClick={
                            () => {
                                cancelParticipation()
                            }
                        }
                        variant={'secondary'}
                        className="self-end"
                    >Cancel participation</Button>
                </>
                :
                <Button onClick={() => { participate() }}
                    className="self-end"
                >Participate</Button>
            }
            <Toaster></Toaster>
        </div>
    )
}
