'use server'
import { redirect } from 'next/navigation'
import { createClient } from "@/utils/supabase/server"

export async function goToPayment() {
    // This function is supposed to redirect the user to the payment page
    // but it's not implemented yet
    console.log('Redirecting to payment page')
    redirect('/publish/payment')
}

export async function postFormToDB(formData: any) {
    console.log('publishing to db')
    console.log(formData)
    const supabase = createClient();
    const { data, error } = await supabase.from('offers').insert([

        // convert all entries to string
        {
            url: formData.url,
            description: formData.description,
            from: formData.date.from,
            to: formData.date.to,
            budget: formData.budget,
            keywords: formData.keywords.map((keyword: { label: string; }) => (keyword.label)).join(','), // convert array to string
            payment_status: 'pending'
        }
    ]).select()
    console.log(error)
    if (error) {
        redirect(`/publish/error`)
    }
    console.log(data)
    // create a payment intent with stripe
    // redirect to payment page

    if (data) {
        // Create payment intent
        redirect(`/publish/payment?budget=${formData.budget}&id=${data[0]?.id ?? ''}`)
    }
    redirect(`/publish/error`)
}

export async function publishNewKeyword(keyword: string) {
    const supabase = createClient();
    const { data, error } = await supabase.from('keywords').insert([
        {
            label: keyword
        }
    ]).select()
    return { data, error}
}