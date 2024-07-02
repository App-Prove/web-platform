
'use client'
import SurveyForm from "@/components/Survey/SurveyForm"
import { useSearchParams } from "next/navigation"


export default async function SurveyPage() {
    const searchParams = useSearchParams()
    const code = searchParams.get('code')


    return (
        <SurveyForm />
    )
}