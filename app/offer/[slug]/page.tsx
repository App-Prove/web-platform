'use server'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clipboard } from "lucide-react";
import Image from "next/image";
import { addDays, format, set, subDays } from "date-fns"
import { createClient } from "@/utils/supabase/server";
import { SquareArrowOutUpRight } from 'lucide-react';
import Link from "next/link";
import { ParticipationForm } from "@/components/ParticipationForm";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { User } from "@supabase/supabase-js";
import { formatOffers } from "@/utils/supabase/format";

export default async function OfferPage({ params }: { params: { slug: string } }) {
    // get id from slug
    const id = params.slug
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('id', id);

    if (error) {
        console.error(error);
        return <div>Unable to find offer</div>
    }

    if (!data) {
        return <div>Loading...</div>
    }

    if (data.length == 0) {
        return <div>Offer not found</div>
    }

    const { data: participatingData, error: participatingError } = await supabase
        .from('participants')
        .select('*')
        .eq('offer_id', id)
        .eq('participant_id', user?.id)
    const participating = participatingData?.length! > 0
    const offer: Offer = formatOffers(data)[0];
    return (
        <div className="flex flex-col gap-4 flex-1">
            <div className="flex gap-4 align-top">
                <Image className='rounded-sm h-full' width={42} height={42} src={"https://github.com/" + offer.url.toLowerCase().split('/')[0] + ".png"} alt={"logo-" + offer.url}></Image>
                <div className="flex flex-col">
                    <h4 className="font-semibold">{offer.url.split('/')[0]}</h4>
                    <div className="flex gap-2 items-center">
                        {offer.keywords?.map((keyword) => (
                            <Badge className='font-normal' variant='secondary' key={keyword}>{keyword}</Badge>
                        ))}
                    </div>
                </div>
            </div>
            <p className={cn(offer.type == 'security' ? 'text-orange' : 'text-blue-500')}>{offer.type == 'security' ? 'This is a security audit. Auditors would have to seek for data breaches' : 'This is a fiability audit. Auditors would have to ensure code errors and bugs are handeled properly.'}</p>
            <p className="text-justify sm:text-pretty">{offer.description}</p>
            <div className="w-full">
                <Label>Github</Label>
                <Link
                    className={cn(
                        "flex flex-row w-full  items-center rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50k text-base",
                        "bg-muted text-muted-foreground ",
                        "w-full flex flex-row cursor-pointer items-center"
                    )}
                    href={'https://github.com/' + offer.url.toLowerCase()} target="_blank">
                    <p className="flex-wrap flex-1">
                        github.com/
                        {offer.url.toLowerCase()}
                    </p>
                    <SquareArrowOutUpRight className="flex-shrink-0" />
                </Link>
            </div >

            {(user && user.id != offer.owner) &&
                <ParticipationForm user={user} offerID={offer.id} participating={participating} prURL={participatingData && participatingData[0]?.pr_url} />
            }
            <div>
                {(user && user.id == offer.owner) &&
                    <Table>
                        <TableCaption>List of developers participating in the audit.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Number</TableHead>
                                <TableHead>Auditor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Chat</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {participatingData?.map((participant, index) => (
                                <TableRow key={participant}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{participant}</TableCell>
                                    <TableCell>Waiting for review</TableCell>
                                    <TableCell className="text-right object-right"><Link className="ml-auto" href="/chat"><ChatBubbleIcon className="cursor-pointer" /></Link></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                }
            </div>
        </div >
    );
}