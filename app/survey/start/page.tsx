"use server"

import SurveyForm from "@/components/Survey/SurveyForm"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"


export default async function SurveyPage() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        // Login user if not logged in
        redirect('/?error=unauthorized')
    }

    return (
        <SurveyForm />
    )
}