import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { Search } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";

export default async function OffersPage() {

    const resultNumber = 10;
    const offers = [
        {
            url: "steinprograms/trading-algorithm",
            title: "steinprograms/trading-algorithm",
            badges: ["C++", "Python", "API", "Trading"],
            description: "Evolving in the trading sector, we are developing robust algorithms in C++. Our software needs to be reliable and verified by different entities to ensure extreme reliability.",
            budget: '1000',

        },
    ]
    // get offers from db here
    const supabase = createClient();
    const { data, error } = await supabase.from('offers').select('*').eq('payment_status', 'complete');
    // combine offers from db and offers from the array
    offers.push(...(data as any[])?.map(offer => ({
        url: offer.id,
        title: offer.url,
        badges: offer.keywords.split(','),
        description: offer.description,
        budget: offer.budget,
    })))

    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <div className="flex gap-6 flex-col md:flex-row">
            <div className="flex w-full md:w-fit self-start items-center text-nowrap gap-2 flex-col">
                <div className="relative ml-auto flex-1 md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                    />
                </div>
                <Input className="border-none self-start" value={offers.length + ' results'} disabled />
            </div>
            <div className="flex-1 flex flex-col gap-6">
                {offers.map(offer => (
                    <Link key={offer.title} href={"/offers/" + offer.url}>
                        <Card className="hover:bg-gray-100 hover:border-black hover:cursor-pointer">
                            <CardHeader>
                                <div className="flex justify-between w-full">
                                    <div className="flex gap-4 w-full">
                                        <div className="flex gap-2 flex-col w-full">
                                            <div className="flex flex-col sm:flex-row justify-between items-center">
                                                <CardTitle className="self-start">{offer.title.split('/')[1]}</CardTitle>
                                                <p className="self-start sm:flex-end">{USDollar.format(Number(offer.budget))}</p>
                                            </div>
                                            <div className="self-start">

                                            <HoverCard>
                                                <HoverCardTrigger asChild>
                                                    <Button className="p-0" variant="link">@{offer.title.split('/')[0]}</Button>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="w-80">
                                                    <div className="flex justify-between space-x-4">
                                                        <Avatar>
                                                            <AvatarImage src={"https://github.com/"+offer.title.split('/')[0]+".png"} />
                                                            <AvatarFallback>VC</AvatarFallback>
                                                        </Avatar>
                                                        <div className="space-y-1">
                                                            <h4 className="text-sm font-semibold">@{offer.title.split('/')[0]}</h4>
                                                            <p className="text-sm">
                                                                The React Framework – created and maintained by @vercel.
                                                            </p>
                                                            <div className="flex items-center pt-2">
                                                                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                                                                <span className="text-xs text-muted-foreground">
                                                                    Joined December 2021
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </HoverCardContent>
                                            </HoverCard>

                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                {offer.badges.map(badge => (
                                                    <Badge className="rounded-sm" variant='secondary' key={badge}>{badge}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex items-center gap-2 sm:gap-24 justify-between flex-col sm:flex-row">
                                <CardDescription className="w-full text-pretty text-lg">
                                    {offer.description}
                                </CardDescription>
                                <div className="text-nowrap flex gap-2 items-center self-end sm:self-auto text-sm">
                                    <p>Show more</p>
                                    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 1.6004L2 1.59998M13 1.6004L1.5 12.0004M13 1.6004V12.4004" stroke="black" strokeWidth="2" />
                                    </svg>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
