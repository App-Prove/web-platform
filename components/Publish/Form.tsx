"use client"

import { CalendarIcon, CaretSortIcon, ReloadIcon } from "@radix-ui/react-icons"
import { format, set, subDays } from "date-fns"
import * as React from "react"
import { DateRange } from "react-day-picker"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useLocalStorage } from "@/lib/localStorage"
import { toast as sonner } from "sonner"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
} from "@/components/ui/command"
import { createPayment, publishNewKeyword, registerOffer, updateOffer } from "@/app/publish/actions"
import { Command as CommandPrimitive } from "cmdk"
import { useCallback, useEffect, useRef, useState } from "react"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { User } from "@supabase/supabase-js"
import { githubLogin } from "../server/action"
import { redirect, useSearchParams } from "next/navigation"

const FormSchema = z.object({
    url: z.string().superRefine((value, ctx) => {
        if (value === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "You forgot to add a repo",
            });
        }
        // Check if repo value is accessible through github
    }
    ),
    description: z.string().superRefine((
        (value, ctx) => {
            if (value === '') ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please add a description",
            });
        }),
    ),
    type: z.string().superRefine((
        (value, ctx) => {
            if (value === '') ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please add a description",
            });
        }),
    ),
    auditors: z.number().superRefine((
        (value, ctx) => {
            if (value < 1) ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please add at least one auditor",
            });
        }),
    ),
    budget: z.string().superRefine((value, ctx) => {
        if (value === '') ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please add a budget",
        });
        if (Number(value) > 20000) ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please choose a reasonable budget",
        });
        // if (Number(value) <= 10) ctx.addIssue({
        //     code: z.ZodIssueCode.custom,
        //     message: "Please choose a budget above 10$",
        // });

    }),
    date: z.custom<DateRange>((value) => {
        if (!value) return false
        if (typeof value !== "object") return false
        if (!("from" in value) || !("to" in value)) return false
        if ((value.from as Date) < subDays(new Date(), 1)) return false
        if (!['object', 'string'].includes(typeof value.from) || !['object', 'string'].includes(typeof value.to)) return false
        if ((value.to as Date) < subDays(new Date(), 1)) return false
        return true
    }, { message: 'Please select a valid date.' }),
    keywords: z.custom<Keyword[]>((value) => {
        if (!value) return false
        if (typeof value !== "object" || !Array.isArray(value)) return false;
        // check if there is at least one element
        if (value.length === 0) return false
        return true
    }, { message: 'Please select at least one keyword.' }),
})


export default function PublishForm({ user }: { user: null | User }) {
    const [commandOpen, setCommandOpen] = React.useState(false)
    const [processing, setProcessing] = React.useState(false)
    const [error, setError] = React.useState<string | undefined>();
    const [repositories, setRepositories] = React.useState<Repository[]>([])
    const [customRepositories, setCustomRepositories] = React.useState<Repository[]>([])
    const [searchTimeout, setSearchTimeout] = React.useState<NodeJS.Timeout>()
    const [searchValue, setSearchValue] = React.useState<string>()


    const [selectedKeywords, setSelectedKeywords] = useLocalStorage<Keyword[]>('selectedKeywords', [{ value: "beta", label: "Beta" } as Keyword]);
    const [budget, setBudget] = useLocalStorage<string>('budget', "500");
    const [url, setUrl] = useLocalStorage<string>('url', "");
    const [description, setDescription] = useLocalStorage<string>('description', "");
    const [selectedRepository, setSelectedRepository] = useLocalStorage<Repository | undefined>('selectedRepository', undefined);
    const [type, setType] = useLocalStorage<string>('type', '');
    const [date, setDate] = useLocalStorage<DateRange>('date', { from: new Date(), to: new Date() });
    const [auditors, setAuditors] = useLocalStorage<number>('auditors', 1)
    const [id, setId] = useLocalStorage<number>('id', 0)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            url: url,
            description: description,
            type: type,
            budget: budget,
            keywords: selectedKeywords,
            date: date,
            auditors: auditors
        }
    })

    const loadGithubProjects = useCallback(async () => {
        // const supabase = createClient()
        // const { data: userData, error } = await supabase.auth.getUser()
        console.log(user)
        if(user==null) return
        const response = await fetch(`https://api.github.com/users/${user?.user_metadata.user_name}/repos`)
        const data = await response.json()
        if (data.message) {
            setError(data.message)
            return
        }
        if (data.error) {
            console.log(data.error)
            setError(data.error)
            return
        }
        setRepositories(data.map((project: Repository) => project as Repository))

    }, []);
    // Check if there is a code in the URL
    const searchParams = useSearchParams()
    const checkAuth = useCallback(() => {
        const code = searchParams.get('code')
        if (code) {
            // If there is a code, we call auth/callback to exchange it for a session
            // and then redirect to start page
            redirect(`/auth/callback?code=${code}&next=/publish`)
        }
    }, [])
    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    const toastError = useCallback(() => {
        if (error) {
            toast({
                title: "Error",
                description: error,
            })
        }
    }
        , [error])
    useEffect(() => {
        toastError()

    }, [toastError])

    useEffect(() => {
        loadGithubProjects();
    }, [loadGithubProjects]);

    const searchGithubProjects = useCallback(async (value: string) => {
        setSearchValue(value)
        console.log(value)
        const response = await fetch(`https://api.github.com/orgs/${value}/repos`)
        const data = await response.json()
        console.log(data)
        if (data.error) {
            setCustomRepositories([])
            setError(data.error)
            return
        }
        if (data.message) {
            setCustomRepositories([])
            setError(data.message)
            return
        }
        setCustomRepositories(data.map((project: Repository) => project as Repository))
    }, []);

    function saveState(data: { url: string; description: string; budget: string; date: DateRange; }) {
        setUrl(data.url)
        setDescription(data.description)
        setBudget(data.budget)
        setDate(data.date)
    }

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setProcessing(true)
        // save all data in states
        saveState(data)
        console.log(data)
        // Check if there is db entry (id in localStorage)
        console.log('ID before', localStorage.getItem('id'))
        if (Number(localStorage.getItem('id')) !== 0) {
            const updateNewOffer = async () => {
                const { data: loadId, error } = await updateOffer(id, {
                    ...data,
                    date: {
                        from: data.date?.from,
                        to: data.date?.to || new Date() // Provide a default value if 'to' is not defined
                    }
                });
                console.log(error)
                if (error) {
                    setError('An error occured while updating the offer: ' + error.message)
                    return
                }
                setId(loadId)
                createPayment(data)
            }
            updateNewOffer();
            if (error)
                sonner('An error occured while updating the offer')
            localStorage.clear()
            console.log('ID after update', id);
            // Refresh page
            window.location.reload()
        }
        else {
            console.log('THERE IS NOTHING YET IN DB')
            const registerNewOffer = async () => {
                const { data: loadId, error } = await registerOffer({
                    ...data,
                    date: {
                        from: data.date?.from,
                        to: data.date?.to || new Date() // Provide a default value if 'to' is not defined
                    }
                });
                setId(loadId)
                createPayment(data)
            }
            registerNewOffer();
            console.log('ID after creation', id);
        }
        // If there isn't create a new entry
        // If there is update the entry
    }

    function onError(errors: any) {
        console.log(errors)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex-1 flex flex-col gap-4">
                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <>
                            <Button type={'reset'} variant={form.getValues('url') ? 'outline' : 'default'} onClick={() => setCommandOpen(true)}>{form.getValues('url') ? field.value : 'Choose a repository'}</Button>
                            <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
                                <CommandInput
                                    placeholder="Start typing to search..."
                                    className="h-9 w-[200px]"
                                    onValueChange={
                                        (e) => {
                                            // If there is 2 sec without a key press, search for the project
                                            if (e.includes('/')) return
                                            if (searchTimeout) clearTimeout(searchTimeout)
                                            setSearchTimeout(setTimeout(() => {
                                                searchGithubProjects(e)
                                            }
                                                , 2000))
                                        }
                                    }
                                />
                                <CommandEmpty>No repository found. <br />{user == null ? <Button
                                    onClick={() => {
                                        githubLogin("publish")
                                    }}>Connect your Github account</Button> : ""}</CommandEmpty>
                                <CommandList>
                                    <CommandGroup heading={searchValue ? searchValue + ' organisation' : ''}>
                                        {customRepositories.map((repository) => (
                                            <CommandItem
                                                value={repository.full_name}
                                                key={repository.full_name}
                                                onSelect={() => {
                                                    form.setValue("url", repository.full_name)
                                                    setSelectedRepository(repository)
                                                    setDescription(repository.description)
                                                    form.setValue("description", repository.description)
                                                    setCommandOpen(false)
                                                }}
                                            >
                                                {repository.name}
                                                <CheckIcon
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        repository.full_name === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                    <CommandGroup heading={repositories.length > 0 ? 'My repositories' : ""}>
                                        {repositories.map((repository) => (
                                            <CommandItem
                                                value={repository.full_name}
                                                key={repository.full_name}
                                                onSelect={() => {
                                                    form.setValue("url", repository.full_name)
                                                    setSelectedRepository(repository)
                                                    setDescription(repository.description)
                                                    form.setValue("description", repository.description)
                                                    setCommandOpen(false)
                                                }}
                                            >
                                                {repository.name}
                                                <CheckIcon
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        repository.full_name === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>

                            </CommandDialog>
                        </>
                    )} />
                <Separator />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <div className="grid w-full gap-1.5">
                            <FormLabel>Short description</FormLabel>
                            <FormControl >
                                <Textarea placeholder="Give a short description of your project" id="message" {...field} />
                            </FormControl>
                            <FormDescription>This is a short description of the work you are looking for</FormDescription>
                            <FormMessage />
                        </div>
                    )}
                />
                <Separator />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Audit type</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={(e) => {
                                        setType(e)
                                        field.onChange(e)
                                    }
                                    }
                                    defaultValue={type}
                                    className="flex flex-col space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="security" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Security
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="reliability" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Reliability
                                        </FormLabel>
                                    </FormItem>
                                    <FormDescription>Auditors are going to seek for SQL injections or bugs and errors</FormDescription>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    className='self-end'
                    type="submit"
                    disabled={processing}
                >
                    {!processing ?

                        <>Publish</>
                        :
                        <>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            <p>Please wait</p>
                        </>
                    }
                </Button>
            </form>
        </Form>
    )
}

