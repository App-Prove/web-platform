"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/utils/supabase/clients"
import { useRouter, useSearchParams } from 'next/navigation'
import React from "react"
import { ReloadIcon } from "@radix-ui/react-icons"
import { sub } from "date-fns"

export default function SurveyForm() {
    const searchParams = useSearchParams()
    const anonymous = searchParams.get('anonymous')
    const isAnonymous = anonymous === "yes"
    const [Submitting, setSubmitting] = React.useState(false)
    const router = useRouter()
    type Question =
        | { question: string; type: 'boolean' }
        | { question: string; type: 'scale' }
        | { question: string; type: 'number' }
        | { question: string; type: 'multiple_choice'; options: [string, ...string[]] };

    var questions: Question[] = [
        {
            question: "Do you believe applications should be reviewed before being deployed to production?",
            type: "boolean"
        },
        {
            question: "How important is it to you if a project is certified by a third party as bug-free?",
            type: "multiple_choice",
            options: ["Bug is part of the game", "It bugs me", "Bugs shouldn't exist in a production app"]
        },
        {
            question: "How important is it to you if a project is certified as being protected against major attacks?",
            type: "multiple_choice",
            options: ["Why would we get attacked?", "We try our best to handle major ones", "We invest a lot in security"]
        },
        {
            question: "How long have you been coding?",
            type: "multiple_choice",
            options: ["1-3 years", "3-5 years", "5+ years"]
        },
        {
            question: "How often do you make major changes (git commits) that are deployed to production?",
            type: "multiple_choice",
            options: ["Daily", "Weekly", "Monthly", "Every 6 months", "Yearly"]
        },
        {
            question: "Is security a concern for you when developing applications?",
            type: "boolean"
        },
        {
            question: "Is reliability (bug handling) a concern for you when developing applications?",
            type: "boolean"
        },
        {
            question: "Do you consider asking colleagues to review your code?",
            type: "boolean"
        },
        {
            question: "Do you prefer having a human review your code or an automated algorithm check it?",
            type: "multiple_choice",
            options: ["Human", "Automated", "Both"]
        },
        {
            question: "How many developers do you think should review code before it is deployed?",
            type: "multiple_choice",
            options: ["1", "2-5", "5 or more"]
        },
        {
            question: "Do you want to know who reviewed your code?",
            type: "boolean"
        },
        {
            question: "What is a reasonable amount you are willing to spend to improve the security and reliability of your code?",
            type: "multiple_choice",
            options: ["500$", "2000$", "10 000$+", "I don't know"]
        },
        {
            question: "Are you willing to review code during your free time for free?",
            type: "boolean"
        },
        {
            question: "Are you willing to review code during your free time in exchange for money?",
            type: "boolean"
        },
        {
            question: "Have you ever participated in a bug bounty contest?",
            type: "boolean"
        },
    ]
    const formSchema = z.object(
        questions.reduce((acc, question, index) => {
            switch (question.type) {
                case "boolean":
                    acc[`question${index}` as const] = z.enum(["yes", "no"], {
                        required_error: "You need to select an option.",
                    });
                    break;
                case "scale":
                    acc[`question${index}` as const] = z.array(z.number().int().min(0).max(100));
                    break;
                case "multiple_choice":
                    acc[`question${index}` as const] = z.enum(question.options, {
                        required_error: "You need to select an option.",
                    });
                    break;
                case "number":
                    acc[`question${index}` as const] = z.number().int().min(0);
                    break;
            }
            return acc;
        }, {} as Record<string, z.ZodType<any, any>>),
    )

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        // defaultValues: questions.reduce((acc, question, index) => {
        //     switch (question.type) {
        //         case "boolean":
        //             acc[`question${index}` as const] = "yes";
        //             break;
        //         case "scale":
        //             acc[`question${index}` as const] = [50];
        //             break;
        //         case "multiple_choice":
        //             acc[`question${index}` as const] = question.options[0];
        //             break;
        //         case "number":
        //             acc[`question${index}` as const] = 0;
        //             break;
        //     }
        //     return acc;
        // }
        //     , {} as Record<string, any>),

    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if(Submitting) return
        setSubmitting(true)
        // console.log("YEY")
        // // Do something with the form values.
        // // ✅ This will be type-safe and validated.
        // console.log(values)
        // toast({
        //     title: "You submitted the following values:",
        //     description: (
        //         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //             <code className="text-white">{JSON.stringify(values)}</code>
        //         </pre>
        //     ),
        // })
        // Push to DB with custom id which correspond to session
        // Redirect to next page
        // Using server action

        // Get parameters from URL
        // If anonymous
        if (isAnonymous) {
            console.log("anonymous")
            
            const supabase = createClient()
            const { data, error } = await supabase.from('survey').insert({
                "question0": values.question0,
                "question1": values.question1,
                "question2": values.question2,
                "question3": values.question3,
                "question4": values.question4,
                "question5": values.question5,
                "question6": values.question6,
                "question7": values.question7,
                "question8": values.question8,
                "question9": values.question9,
                "question10": values.question10,
                "question11": values.question11,
                "question12": values.question12,
                "question13": values.question13,
                "question14": values.question14,
            }).select()
            console.log(data)
            console.log(error)
            router.push('/survey/thank-you')
            return
        }



        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        const payload = {
            "id": user?.id,
            "question0": values.question0,
            "question1": values.question1,
            "question2": values.question2,
            "question3": values.question3,
            "question4": values.question4,
            "question5": values.question5,
            "question6": values.question6,
            "question7": values.question7,
            "question8": values.question8,
            "question9": values.question9,
            "question10": values.question10,
            "question11": values.question11,
            "question12": values.question12,
            "question13": values.question13,
            "question14": values.question14,
        }

        const { data, error } = await supabase.from('survey').insert(
            payload
        ).select()
        console.log(data, error)
        if (error) {
            const { data: dataUpdate, error: errorUpdate } = await supabase.from('survey').update(
                payload
            ).eq('id', user?.id).select()
            console.log(dataUpdate, errorUpdate)
            if (errorUpdate) {
                router.push('/survey/error')
            }
        }
        router.push('/survey/thank-you')
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-8 mb-12 w-full">
                {
                    questions.map((question, index) => {
                        return (
                            <div key={index} className="flex flex-col gap-y-4">
                                <h2>{`${index + 1}. ${question.question}`}</h2>
                                <div className="flex flex-col gap-y-8">
                                    {
                                        question.type === "boolean" && <FormField
                                            control={form.control}
                                            name={`question${index}`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <div className="flex items-center space-x-2" key={`question${index}-yes`}>
                                                                <FormControl>
                                                                    <RadioGroupItem id={`question${index}`} value="yes" />
                                                                </FormControl>
                                                                <FormLabel htmlFor={`question${index}`}>Yes</FormLabel>
                                                            </div>
                                                            <div className="flex items-center space-x-2" key={`question${index}-no`}>
                                                                <FormControl>
                                                                    <RadioGroupItem id={`question${index}No`} value="no" />
                                                                </FormControl>
                                                                <FormLabel htmlFor={`question${index}No`}>No</FormLabel>
                                                            </div>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    }
                                    {
                                        question.type === "scale" && <FormField
                                            control={form.control}
                                            name={`question${index}`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex gap-x-12 ">
                                                        <FormLabel>Not</FormLabel>
                                                        <FormControl>
                                                            <Slider defaultValue={field.value} max={100} step={1} {...field} />
                                                        </FormControl>
                                                        <FormLabel>Very</FormLabel>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    }
                                    {
                                        question.type === "multiple_choice" && question.options && <FormField
                                            control={form.control}
                                            name={`question${index}`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            {
                                                                question.options.map((option, optionIndex) => {
                                                                    return (
                                                                        <FormItem className="flex items-center space-x-2" key={optionIndex}>
                                                                            <FormControl>
                                                                                <RadioGroupItem id={`question${index}${optionIndex}`} value={option} />
                                                                            </FormControl>
                                                                            <FormLabel htmlFor={`question${index}${optionIndex}`}>{option}</FormLabel>
                                                                        </FormItem>
                                                                    )
                                                                })
                                                            }
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    }
                                    {
                                        question.type === "number" && <FormField
                                            control={form.control}
                                            name={`question${index}`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="number" onChange={(e) => {
                                                            form.setValue(`question${index}`, Number(e.target.value))
                                                        }} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    }
                                </div>
                            </div>
                        )
                    })
                }
                <Button className="flex self-end" type="submit">
                    {
                        !Submitting ?
                            "Submit my answers"
                            :
                            <>
                                <ReloadIcon className="sm:mr-2 h-4 w-4 animate-spin" />
                                <p className="hidden sm:block">Please wait</p>
                            </>

                    }
                </Button>
            </form>
        </Form>
    )
}