"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"
import { zodResolver } from "@hookform/resolvers/zod"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { redirect } from 'next/navigation'
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/utils/supabase/clients"
import { Separator } from "@/components/ui/separator"


const FormSchema = z.object({
    language: z.string({
        required_error: "Please select a language.",
    }),
    url: z.string({
    }).url({ message: "Add a valid url" }),
    description: z.string({
        required_error: "Please add a description.",
    }),
    budget: z.number({
        required_error: "Please fill in the budget field.",
    }),
    cardNumber: z.number({
        required_error: "Please fill in the card number field.",
    }),
    date: z.custom<DateRange>((value) => {
        if (!value) return false
        if (typeof value !== "object") return false
        if (!("from" in value) || !("to" in value)) return false
        if ((value.from as Date) < new Date()) return false
        if (typeof value.to !== "object") return false
        return true
    },{message: 'Please select a valid date.'}),
})

export default function PrivatePage() {
    // const supabase = createClient()

    // const { data, error } = await supabase.auth.getUser()
    // if (error || !data?.user) {
    //     redirect('/login')
    // }


    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 20),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            url: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log('test')
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }
    return (
        <div className='h-full max-w-2xl mx-auto flex flex-col gap-4'>
            <h1>
                Offer
            </h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (<>
                            <div className="grid w-full gap-1.5">
                                <FormLabel>Project url</FormLabel>
                                <div className='flex'>
                                    <Input className='rounded-e-none w-fit' disabled type="domain" id="domain" value="github.com/" />
                                    <FormControl>
                                        <Input className='rounded-l-none' placeholder="" {...field} />
                                    </FormControl>
                                </div>
                                <FormMessage />

                            </div>
                        </>)}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <div className="grid w-full gap-1.5">
                                <FormLabel>Short description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Explain what the auditor has to look at." id="message" {...field} />
                                </FormControl>
                                <FormMessage />
                            </div>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="date">Auditing period</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                id="date"
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[300px] justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value?.from ? (
                                                    field.value.to ? (
                                                        <>
                                                            {format(field.value.from, "LLL dd, y")} -{" "}
                                                            {format(field.value.to, "LLL dd, y")}
                                                        </>
                                                    ) : (
                                                        format(field.value.from, "LLL dd, y")
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={field.value?.from}
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            numberOfMonths={1}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </div>

                        )}
                    />

                    <Separator />
                    <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                            <div className="grid w-full gap-1.5">
                                <FormLabel>Budget</FormLabel>
                                <FormControl>
                                    <Input className="self-start " type="number" id="budget" placeholder="how much are you willing to spend?" {...field} />
                                </FormControl>
                                <FormMessage />
                            </div>
                        )}
                    />
                    <Button className='self-end' type="submit">Proceed to payment</Button>
                </form>
            </Form>

        </div>
    )
}
