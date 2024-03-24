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
import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/ui/datepicker-with-range'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { KeywordsSelector } from '@/components/ui/keywords-selector'
import { goToPayment } from './actions'
export default async function PrivatePage() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    return (
        <div className='h-full max-w-2xl mx-auto flex flex-col gap-4'>
            <form className='flex-1 flex flex-col gap-4'>
                <h1>
                    Offer
                </h1>
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="url">Project url</Label>
                    <div className='flex'>
                        <Input className='rounded-e-none w-fit' disabled type="domain" id="domain" value="github.com/" />
                        <Input className='rounded-l-none' type="url" id="url" placeholder="" />
                    </div>

                </div>
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="description">Short description</Label>
                    <Textarea placeholder="Explain what the auditor has to look at." id="message" />
                </div>
                <div>
                    <KeywordsSelector></KeywordsSelector>
                </div>
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="date">Auditing period</Label>
                    <DatePickerWithRange></DatePickerWithRange>
                </div>
                <Button className='self-end' formAction={goToPayment}>Continue</Button>
            </form>
            <Breadcrumb className='self-center'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbEllipsis />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Offer creation</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

        </div>
    )
}