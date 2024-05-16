"use client"
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils";


export default function Offers({offers}:{offers: Offer[]}) {
    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    return (
        <div className="flex-1 flex flex-col gap-4">
            {offers.map(offer => (
                <Link key={offer.url} href={"/offer/" + offer.id}>
                    <Card className="hover:cursor-pointer flex gap-0 flex-col">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between w-full">
                                <div className="flex gap-4 w-full align-top">
                                    <div className="self-center flex-shrink-0">
                                        <Image className='rounded-sm h-full' width={42} height={42} src={"https://github.com/" + offer.url.toLowerCase().split('/')[0] + ".png"} alt={"logo-" + offer.url}></Image>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <div className="flex flex-col sm:flex-row justify-between items-center">
                                            <CardTitle className="self-start flex flex-wrap text-sm items-center gap-2">
                                                {offer.url.split('/')[0]}
                                            </CardTitle>
                                            {Number(offer.budget)==0?
                                            <p className="self-start sm:flex-end text-muted-foreground hidden sm:block">Free</p>
                                        :
                                            <p className="self-start sm:flex-end text-muted-foreground hidden sm:block">Estimated payout {USDollar.format(Number(offer.budget))}</p>
                                        }
                                        </div>
                                        <div className="gap-2 flex-wrap flex">
                                            <Badge variant='secondary' className="font-normal gap-x-2 flex">
                                                <svg className='hidden sm:block' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M8 0.197388C3.58 0.197388 0 3.77739 0 8.19739C0 11.7374 2.29 14.7274 5.47 15.7874C5.87 15.8574 6.02 15.6174 6.02 15.4074C6.02 15.2174 6.01 14.5874 6.01 13.9174C4 14.2874 3.48 13.4274 3.32 12.9774C3.23 12.7474 2.84 12.0374 2.5 11.8474C2.22 11.6974 1.82 11.3274 2.49 11.3174C3.12 11.3074 3.57 11.8974 3.72 12.1374C4.44 13.3474 5.59 13.0074 6.05 12.7974C6.12 12.2774 6.33 11.9274 6.56 11.7274C4.78 11.5274 2.92 10.8374 2.92 7.77739C2.92 6.90739 3.23 6.18739 3.74 5.62739C3.66 5.42739 3.38 4.60739 3.82 3.50739C3.82 3.50739 4.49 3.29739 6.02 4.32739C6.66 4.14739 7.34 4.05739 8.02 4.05739C8.7 4.05739 9.38 4.14739 10.02 4.32739C11.55 3.28739 12.22 3.50739 12.22 3.50739C12.66 4.60739 12.38 5.42739 12.3 5.62739C12.81 6.18739 13.12 6.89739 13.12 7.77739C13.12 10.8474 11.25 11.5274 9.47 11.7274C9.76 11.9774 10.01 12.4574 10.01 13.2074C10.01 14.2774 10 15.1374 10 15.4074C10 15.6174 10.15 15.8674 10.55 15.7874C12.1381 15.2512 13.5182 14.2306 14.4958 12.869C15.4735 11.5075 15.9996 9.87359 16 8.19739C16 3.77739 12.42 0.197388 8 0.197388Z" fill="black" />
                                                </svg>
                                                {offer.url}
                                            </Badge>

                                    <Badge onClick={(e)=>{e.stopPropagation()}} className={cn('z-50 cursor-pointer font-normal hidden sm:block',offer.type=='security'?'bg-orange text-white':'bg-blue-500 text-white')} variant='secondary' key={offer.type}>{offer.type}</Badge>
                                            {offer.badges.map(badge => (
                                                <Badge className='font-normal hidden sm:block' variant='secondary' key={badge}>{badge}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-y-4 sm:gap-y-0 text-sm sm:text-base text-justify sm:text-pretty">
                            <div className="flex gap-2 pb-2 sm:hidden">
                                    <Badge onClick={(e)=>{e.stopPropagation()}} className={cn('z-50 cursor-pointer font-normal sm:hidden',offer.type=='security'?'bg-orange text-white':'bg-blue-500 text-white')} variant='secondary' key={offer.type}>{offer.type}</Badge>

                                {offer.badges.map(badge => (
                                    <Badge className='font-normal sm:hidden' variant='secondary' key={badge}>{badge}</Badge>
                                ))}
                            </div>
                            {offer.description}
                            <p className="self-end text-muted-foreground block sm:hidden text-xs">Estimated payout {USDollar.format(Number(offer.budget))}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>

    )
}