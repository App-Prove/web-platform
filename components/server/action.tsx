'use server'
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export async function logout() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
}

export async function postFormToDB(data: any) {
    console.log('publishing to db')
    console.log(data)
    const supabase = createClient();
    const error = await supabase.from('offers').insert([
        // convert all entries to string
        {
            url: data.url,
            description: data.description,
            from: data.date.from,
            to: data.date.to,
            budget: data.budget,
            frameworks: data.frameworks.map((framework: { label: string; })=>(framework.label)).join(','), // convert array to string
        }
    ])
    console.log(error)
    redirect('/offers')

}