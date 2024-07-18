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
import { ReloadIcon } from "@radix-ui/react-icons"
import { SuccessAnimation } from "./LottieAnimations"

const FormSchema = z.object({
    prURL: z.string().url({
        message: "Please provide a valid URL.",
    })
})

export function ParticipationForm({ user, participating, offerID, prURL }: { user: User, participating: boolean, offerID: number, prURL: string }) {
    const [PRURLValidated, setPRURLValidated] = useState(false)
    const [validatingPRURL, setValidatingPRURL] = useState(false)
    const [participationRegistered, setParticipationRegistered] = useState(participating)
    const [submittingPR, setSubmittingPR] = useState(false)
    const [registeringParticipation, setRegisteringParticipation] = useState(false)
    const [cancelingParticipation, setCancelingParticipation] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            prURL: prURL ?? '',
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setValidatingPRURL(true)
        setSubmittingPR(true)
        const supabase = createClient()
        // upload to db
        // Check if user exists
        const { data: { user: userData }, error: userError } = await supabase.auth.getUser()
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
        setValidatingPRURL(false)
        setPRURLValidated(true)
        toast('PR URL submitted')
        setSubmittingPR(false)
    }
    const participate = useCallback(async () => {
        setRegisteringParticipation(true)
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
        setRegisteringParticipation(false)
        toast('Participation registered')
    }, [participationRegistered])


    const cancelParticipation = useCallback(
        async () => {
            setCancelingParticipation(true)
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
            setCancelingParticipation(false)
        }, [participationRegistered])
    return (
        <div className="flex flex-col gap-4">
            {
                participationRegistered &&
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex-1 flex flex-col sm:flex-row gap-2">
                        <FormField
                            control={form.control}
                            name="prURL"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pull Request URL</FormLabel>
                                    <div className="flex items-center gap-x-2">
                                        <FormControl>
                                            <Input placeholder="Put your pull request URL" {...field} />
                                        </FormControl>
                                        {validatingPRURL && <ReloadIcon className="h-4 w-4 animate-spin"></ReloadIcon>}
                                        {PRURLValidated && <SuccessAnimation></SuccessAnimation>}
                                    </div>
                                    <FormDescription>
                                        Put your pull request URL from github once you have submitted your PR.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">{!submittingPR ? prURL === null ? "Submit" : "Update your PR URL" : <>
                            <ReloadIcon className="sm:mr-2 h-4 w-4 animate-spin" />
                            <p className="hidden sm:block">Submitting your PR...</p>

                        </>}</Button>
                    </form>
                </Form>
            }
            {(participationRegistered) ?
                <div className="flex flex-col">
                    <Button
                        onClick={
                            () => {
                                cancelParticipation()
                            }
                        }
                        variant={'secondary'}
                        className="self-end"
                    >{!cancelingParticipation ? "Cancel participation" : <>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        <p className="">Canceling participation</p>
                    </>}</Button>
                </div>
                :

                <Button onClick={() => { participate() }}
                    className="self-end"
                >{!registeringParticipation ? "Participate" : <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    <p className="">Registering</p>
                </>}</Button>

            }
            <Toaster></Toaster>
        </div>
    )
}
