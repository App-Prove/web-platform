import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from '@/components/ui/input'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"
import Link from 'next/link'
import { CheckoutForm, Return } from '@/components/Publish/Checkout'

export default async function PrivatePage() {
    return (
        <div className='flex flex-1 flex-col'>
            <div className='flex-1'>
            <h1>Payment</h1>
                <CheckoutForm></CheckoutForm>
            </div>
        </div>
    )
}