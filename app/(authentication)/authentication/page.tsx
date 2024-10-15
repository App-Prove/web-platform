'use server'
import Authentication from "./components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        redirect('/dashboard');
    }
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <Authentication></Authentication>
        </div>
    )
}