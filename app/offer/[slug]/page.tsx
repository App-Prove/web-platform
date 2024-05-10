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
import { ParticipateButton } from "@/components/participateButton";
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


export default async function OfferPage({ params }: { params: { slug: string } }) {
    // get id from slug
    const id = params.slug
    const supabase = createClient();
    const { data, error } = await supabase.from('offers').select('*').eq('id', id);
    const offer: Offer = data && data[0] && {
        id: data[0].id,
        url: data[0].url,
        badges: data[0].keywords.split(','),
        description: data[0].description,
        budget: data[0].budget,
        from: data[0].from,
        to: data[0].to,
        participants: data[0].participants,
        type: data[0].type,
        owner: data[0].owner,
    } as Offer;

    console.log(offer)
    const { data: { user } } = await supabase.auth.getUser()
    // Check if user id is in the list of participants
    return (
        <div className="flex flex-col gap-4 flex-1">
            <div className="flex gap-4 align-top">
                <Image className='rounded-sm h-full' width={42} height={42} src={"https://github.com/" + offer.url.toLowerCase().split('/')[0] + ".png"} alt={"logo-" + offer.url}></Image>
                <div className="flex flex-col">
                    <h4 className="font-semibold">{offer.url.split('/')[0]}</h4>
                    <div className="flex gap-2 items-center">
                        {offer.badges.map((badge) => (
                            <Badge className='font-normal' variant='secondary' key={badge}>{badge}</Badge>
                        ))}
                    </div>
                </div>
            </div>
            <p className={cn(offer.type == 'security' ? 'text-orange' : 'text-blue-500')}>{offer.type == 'security' ? 'This is a security audit. Auditors would have to seek for data breaches' : 'This is a fiability audit. Auditors would have to ensure code errors and bugs are handeled properly.'}</p>
            <p className="text-justify sm:text-pretty">{offer.description}</p>
            <div>
                <Label>Github</Label>
                <Link className="flex cursor-pointer items-center" href={'https://github.com/' + offer.url.toLowerCase()}>
                    <Input disabled placeholder={'github.com/'} className="w-[120px] bg-muted text-muted-foreground rounded-r-none border-r-0"></Input>
                    <Input disabled placeholder={offer.url.toLowerCase()} className="text-muted-foreground rounded-l-none pr-12"></Input>
                    <SquareArrowOutUpRight className="-translate-x-10" />
                </Link>
            </div>
            <div className="flex flex-col gap-2">
                <Label>Audit period</Label>
                <Button
                    disabled
                    id="date"
                    variant={"outline"}
                    className={cn(
                        "text-base w-[300px] justify-start text-left font-normal",
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <>
                        {format(offer.from, "LLL dd, y")} -{" "}
                        {format(offer.to, "LLL dd, y")}
                    </>
                </Button>
            </div>
            <div className="flex self-end">
                {(user && user.id != offer.owner) &&
                    <ParticipateButton user={user} offerID={offer.id} participants={offer.participants} />
                }
            </div>
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
                            {offer.participants?.map((participant, index) => (
                                <TableRow key={participant}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{participant}</TableCell>
                                    <TableCell>Waiting for review</TableCell>
                                    <TableCell className="text-right object-right"><Link className="ml-auto" href={``}><ChatBubbleIcon className="cursor-pointer" /></Link></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                }

            </div>
        </div>
    );
}