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
import {ParticipateButton } from "@/components/participateButton";

export default async function OfferPage({ params }: { params: { slug: string } }) {
    // get id from slug
    const id = params.slug
    const supabase = createClient();
    const { data, error } = await supabase.from('offers').select('*').eq('id', id);
    const offer: offer = data && data[0] && {
        id: data[0].id,
        url: data[0].url,
        badges: data[0].keywords.split(','),
        description: data[0].description,
        budget: data[0].budget,
        from: data[0].from,
        to: data[0].to,
        participants: data[0].participants,
    } as offer;

    console.log(offer)
    const { data: { user } } = await supabase.auth.getUser()
    // Check if user id is in the list of participants
    const isParticipating = user ? offer.participants.includes(user.id) : false;
    return (
        <div className="flex flex-col gap-4">
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
                    {user&&
                    <ParticipateButton user={user} offerID={offer.id} participants={offer.participants} />
                    }
            </div>
        </div>
    );
}