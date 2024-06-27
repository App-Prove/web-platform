"use server"
import SurveyAuthButton from "@/components/Survey/SurveyAuthButton"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { redirect, useSearchParams } from "next/navigation"
import React from "react"

export default async function SurveyPage() {
    const supabase = createClient()
    const { data } = await supabase.auth.getUser()
    const user = data?.user

    if (!user) {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `http://localhost:3000/survey`,
            },
        })
    }

    return (
        <div className="flex-1 flex flex-col gap-y-8 overflow-hidden">
            <h1 className="text-xl">Welcome to App-Prove survey</h1>
            <p className="text-pretty">
                Thank you for taking the time to participate in our Developer Survey.
            </p>
            <p>
                Our goal is to gather valuable insights from experienced developers like you to better understand your needs and preferences.
            </p>
            <div>
                <p className="text-sm text-muted-foreground">
                    By answering these questions, you&apos;ll contribute to improving the security, reliability, and overall quality of applications across the community.
                </p>
                <p className="text-sm text-muted-foreground">
                    Your input is crucial in shaping the future of our services and making sure we address the real challenges you face in your development work.
                    We appreciate your participation and look forward to your valuable insights.
                </p>
            </div>
            <SurveyAuthButton user={user}></SurveyAuthButton>

        </div>
    )
}