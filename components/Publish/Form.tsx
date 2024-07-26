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
import { cn } from "@/lib/utils"
import { useLocalStorage } from "@/lib/localStorage"
import { toast as sonner, toast } from "sonner"
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
import { createPayment, publishNewKeyword, registerOffer } from "@/app/publish/actions"
import { useCallback, useEffect, useRef, useState } from "react"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { User } from "@supabase/supabase-js"
import { githubLogin } from "../server/action"
import { redirect, useRouter, useSearchParams } from "next/navigation"
import { register } from "module"
import { Toaster } from "../ui/sonner"
import { FolderGit, Github } from "lucide-react"

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
})


export default function PublishForm({ user }: { user: null | User }) {
    const router = useRouter()
    const [commandOpen, setCommandOpen] = React.useState(false)
    const [processing, setProcessing] = React.useState(false)
    const [error, setError] = React.useState<string | undefined>();
    const [repositories, setRepositories] = React.useState<Repository[]>([])
    const [customRepositories, setCustomRepositories] = React.useState<Repository[]>([])
    const [searchTimeout, setSearchTimeout] = React.useState<NodeJS.Timeout>()
    const [searchValue, setSearchValue] = React.useState<string>()
    const [connecting, setConnecting] = React.useState(false)


    const [affiliate, setAffiliate] = useLocalStorage<string>('affiliate', '')
    const [pricing, setPricing] = useLocalStorage<string>('pricing', '')
    const [id, setId] = useLocalStorage<number>('id', 0)
    const [auditType, setAuditType] = useLocalStorage<string>('auditType', '')
    const [url, setUrl] = useLocalStorage<string>('url', '')




    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
        }
    })

    // Check if there is a code in the URL
    const searchParams = useSearchParams()
    useEffect(() => {
        const affiliateCode = searchParams.get('affiliate')
        const pricingType = searchParams.get('pricing')
        setError(searchParams.get('error')??undefined)
        if (affiliateCode) setAffiliate(affiliateCode);
        if (pricingType) setPricing(pricingType);
        const code = searchParams.get('code')
        if (code) {
            // If there is a code, we call auth/callback to exchange it for a session
            // and then redirect to start page
            redirect(`/auth/callback?code=${code}&next=/publish`)
        }
    }, [])

    const toastError = useCallback(() => {
        if (error) {
            toast.error(error)
        }
    }
        , [error])

    useEffect(() => {
        toastError()
    }, [toastError])

    const fetchRepositories = useCallback(async () => {
        if (user == null) return
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
    }, [setRepositories]);
    useEffect(() => {
        fetchRepositories()
    }, [fetchRepositories]);

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


    function onSubmit(data: z.infer<typeof FormSchema>) {
        setProcessing(true)
        setUrl(data.url)
        setAuditType(data.type)
        const registeringOffer = async () => {
            const { data: loadId, error } = await registerOffer({
                pricing: pricing,
                ...data,
            });
            loadId && setId(loadId)
            router.push(`/publish/analysis`)
            // createPayment(data)
        }
        registeringOffer()
    }

    function onError(errors: any) {
        toast.error("Please fill in the form correctly")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex-1 flex flex-col gap-4">
                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <>
                            <Button type={'reset'} variant={field.value ? 'outline' : 'default'} onClick={() => setCommandOpen(true)} className="">{field.value ? field.value : <span className="flex gap-x-2 items-center"><FolderGit />Select a repository</span>}</Button>

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
                                        setConnecting(true)
                                        githubLogin("publish")
                                    }}>{connecting ?
                                        <>
                                            <ReloadIcon className="sm:mr-2 h-4 w-4 animate-spin" />
                                            <p className="hidden sm:block">Please wait</p>
                                        </>
                                        : "Connect your Github account"}</Button> : ""}</CommandEmpty>
                                <CommandList>
                                    <CommandGroup heading={searchValue ? searchValue + ' organisation' : ''}>
                                        {customRepositories.map((repository) => (
                                            <CommandItem
                                                value={repository.full_name}
                                                key={repository.full_name}
                                                onSelect={() => {
                                                    form.setValue("url", repository.full_name)
                                                    repository.description && form.setValue("description", repository.description)
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
                                                    repository.description && form.setValue("description", repository.description)
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
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
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

                        <>Scan code</>
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

