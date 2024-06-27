"use client"

import { CalendarIcon, CaretSortIcon, ReloadIcon } from "@radix-ui/react-icons"
import { format, set, subDays } from "date-fns"
import * as React from "react"
import { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
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
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/clients"
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
import { X } from "lucide-react"
import { createPayment, publishNewKeyword, registerOffer, updateOffer } from "@/app/publish/actions"
import { Badge } from "@/components/ui/badge"
import { Command as CommandPrimitive } from "cmdk"
import { useCallback, useEffect, useRef, useState } from "react"
import CurrencyInput from 'react-currency-input-field'
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

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


export default function PublishForm() {
    const [commandOpen, setCommandOpen] = React.useState(false)
    const [processing, setProcessing] = React.useState(false)
    const [error, setError] = React.useState<string | undefined>();
    const [repositories, setRepositories] = React.useState<Repository[]>([])
    const [customRepositories, setCustomRepositories] = React.useState<Repository[]>([])
    const [searchTimeout, setSearchTimeout] = React.useState<NodeJS.Timeout>()
    const [searchValue, setSearchValue] = React.useState<string>()

    // Load initial state from localStorage
    const getInitialState = <T extends unknown>(key: string, defaultValue: T): T => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(key);
            if (saved) {
                if (saved === 'undefined') return defaultValue
                return JSON.parse(saved);
            }
        }
        return defaultValue;
    };

    // Save state to localStorage
    const useLocalStorage = <T extends unknown>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
        const [storedValue, setStoredValue] = useState<T>(() => getInitialState(key, initialValue));

        const setValue = (value: T | ((val: T) => T)) => {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        };

        return [storedValue, setValue];
    };

    const [selectedKeywords, setSelectedKeywords] = useLocalStorage<Keyword[]>('selectedKeywords', [{value:"beta",label:"Beta"} as Keyword]);
    const [budget, setBudget] = useLocalStorage<string>('budget', "0");
    const [url, setUrl] = useLocalStorage<string>('url', "");
    const [description, setDescription] = useLocalStorage<string>('description', "");
    const [selectedRepository, setSelectedRepository] = useLocalStorage<Repository | undefined>('selectedRepository', undefined);
    const [type, setType] = useLocalStorage<string>('type', '');
    const [date, setDate] = useLocalStorage<DateRange>('date', { from: undefined, to: undefined });
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
        const supabase = createClient()
        const { data: userData, error } = await supabase.auth.getUser()
        const response = await fetch(`https://api.github.com/users/${userData.user?.user_metadata.user_name}/repos`)
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
                                <CommandEmpty>No framework found. Press <CommandShortcut>spacebar</CommandShortcut></CommandEmpty>
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
                                    <CommandGroup heading='My repositories'>
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
                                            <RadioGroupItem value="fiability" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Fiability
                                        </FormLabel>
                                    </FormItem>
                                    <FormDescription>Auditors are going to seek for SQL injections or bugs and errors</FormDescription>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Separator />
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="date">Auditing period</Label>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                                "text-base w-[300px] justify-start text-left font-normal",
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
                                                <span
                                                    className="text-muted-foreground text-base"
                                                >Pick a date</span>
                                            )}
                                        </Button>
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
                            </FormControl>
                            <FormDescription>This is the period you would like the audit to take place</FormDescription>
                            <FormMessage />
                        </div>

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

