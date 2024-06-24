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
import Link from "next/link"
import { createClient } from "@/utils/supabase/clients"
import AuthButton from "@/components/AuthButton"

export default async function SurveyPage() {

    const supabase = createClient()
    const { data } = await supabase.auth.getUser()
    const user = data?.user

    return (
        <div className="flex flex-col gap-y-8">
            <h1 className="text-xl">Welcome to App-Prove survey</h1>
            <p className="text-pretty">
                Thank you for taking the time to participate in our Developer Survey.
            </p>
            <p>
                Our goal is to gather valuable insights from experienced developers like you to better understand your needs and preferences.
            </p>
            <div>
                <p className="text-sm text-muted-foreground">
                    By answering these questions, you'll contribute to improving the security, reliability, and overall quality of applications across the community.
                </p>
                <p className="text-sm text-muted-foreground">
                    Your input is crucial in shaping the future of our services and making sure we address the real challenges you face in your development work.
                    We appreciate your participation and look forward to your valuable insights.
                </p>
            </div>
            {user?
            <Link href={"survey/1"} className="flex self-end">
                <Button className="flex self-end">Start survey</Button>
            </Link>
            :
            <Button onClick={() => toast({ title: "Please sign in to continue", description:"" ,variant: "destructive", action:<AuthButton user={user}></AuthButton>})}>Start survey</Button>
        }
        </div>
    )
}