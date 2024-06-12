"use client"
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils";


export default function Offer({ offer }: { offer: Offer }) {
    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    return (
        <Link key={offer.url} href={"/offer/" + offer.id}>
            <Card className="hover:cursor-pointer flex gap-0 flex-col py-0">
                <CardHeader className="py-2">
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
                                    <p className="self-start sm:flex-end text-muted-foreground hidden sm:block">
                                        {Number(offer.budget) == 0 ?
                                            "Free"

                                            :
                                            "Estimated payout" + USDollar.format(Number(offer.budget))
                                        }
                                    </p>
                                </div>
                                <div className="gap-2 flex-wrap flex">
                                    <Badge variant='secondary' className="font-normal gap-x-2 flex">
                                        <svg className='hidden sm:block' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M8 0.197388C3.58 0.197388 0 3.77739 0 8.19739C0 11.7374 2.29 14.7274 5.47 15.7874C5.87 15.8574 6.02 15.6174 6.02 15.4074C6.02 15.2174 6.01 14.5874 6.01 13.9174C4 14.2874 3.48 13.4274 3.32 12.9774C3.23 12.7474 2.84 12.0374 2.5 11.8474C2.22 11.6974 1.82 11.3274 2.49 11.3174C3.12 11.3074 3.57 11.8974 3.72 12.1374C4.44 13.3474 5.59 13.0074 6.05 12.7974C6.12 12.2774 6.33 11.9274 6.56 11.7274C4.78 11.5274 2.92 10.8374 2.92 7.77739C2.92 6.90739 3.23 6.18739 3.74 5.62739C3.66 5.42739 3.38 4.60739 3.82 3.50739C3.82 3.50739 4.49 3.29739 6.02 4.32739C6.66 4.14739 7.34 4.05739 8.02 4.05739C8.7 4.05739 9.38 4.14739 10.02 4.32739C11.55 3.28739 12.22 3.50739 12.22 3.50739C12.66 4.60739 12.38 5.42739 12.3 5.62739C12.81 6.18739 13.12 6.89739 13.12 7.77739C13.12 10.8474 11.25 11.5274 9.47 11.7274C9.76 11.9774 10.01 12.4574 10.01 13.2074C10.01 14.2774 10 15.1374 10 15.4074C10 15.6174 10.15 15.8674 10.55 15.7874C12.1381 15.2512 13.5182 14.2306 14.4958 12.869C15.4735 11.5075 15.9996 9.87359 16 8.19739C16 3.77739 12.42 0.197388 8 0.197388Z" fill="black" />
                                        </svg>
                                        {offer.url}
                                    </Badge>

                                    <Badge onClick={(e) => { e.stopPropagation() }} className={cn(' z-50 cursor-pointer font-normal hidden sm:block', offer.type == 'security' ? 'bg-orange text-white' : 'bg-blue-500 text-white')} variant='outline' key={offer.type}>{offer.type}</Badge>
                                    {offer.badges.map(badge => (
                                        <Badge className='font-normal hidden sm:block' variant='secondary' key={badge}>{badge}</Badge>
                                    ))}

                                    <div className="flex items-center gap-2">
                                        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M2.28564 2.14294C2.28564 1.73881 2.44619 1.35122 2.73196 1.06545C3.01772 0.779684 3.40531 0.619141 3.80945 0.619141H11.4147C11.8188 0.619227 12.2064 0.779827 12.4921 1.06561L15.5534 4.12693C15.8392 4.41264 15.9998 4.80016 15.9999 5.20426V15.8572C15.9999 16.2613 15.8393 16.6489 15.5536 16.9347C15.2678 17.2204 14.8802 17.381 14.4761 17.381H3.61897C3.46742 17.381 3.32208 17.3208 3.21491 17.2136C3.10775 17.1064 3.04755 16.9611 3.04755 16.8095C3.04755 16.658 3.10775 16.5126 3.21491 16.4055C3.32208 16.2983 3.46742 16.2381 3.61897 16.2381H14.4761C14.5771 16.2381 14.674 16.198 14.7454 16.1265C14.8169 16.0551 14.857 15.9582 14.857 15.8572V6.3334H11.8094C11.4053 6.3334 11.0177 6.17286 10.7319 5.88709C10.4461 5.60132 10.2856 5.21373 10.2856 4.8096V1.76199H3.80945C3.70841 1.76199 3.61152 1.80213 3.54007 1.87357C3.46863 1.94501 3.4285 2.04191 3.4285 2.14294V6.90483C3.4285 7.05638 3.36829 7.20172 3.26113 7.30888C3.15397 7.41605 3.00862 7.47625 2.85707 7.47625C2.70552 7.47625 2.56017 7.41605 2.45301 7.30888C2.34585 7.20172 2.28564 7.05638 2.28564 6.90483V2.14294ZM11.4285 1.76199V4.8096C11.4285 4.91063 11.4686 5.00753 11.54 5.07897C11.6115 5.15041 11.7084 5.19055 11.8094 5.19055H14.857C14.8537 5.09421 14.8139 5.00274 14.7458 4.93455L11.6845 1.87323C11.6163 1.8051 11.5248 1.76535 11.4285 1.76199Z" fill="#7D7D7D" />
                                            <path d="M3.45149 9.18293C3.50257 9.23791 3.54232 9.30241 3.56847 9.37275C3.59462 9.44309 3.60666 9.51789 3.60391 9.59289C3.60115 9.66789 3.58364 9.7416 3.55239 9.80983C3.52114 9.87806 3.47676 9.93947 3.42177 9.99054L1.41112 11.8572L3.42254 13.7239C3.47757 13.775 3.52199 13.8365 3.55326 13.9047C3.58454 13.973 3.60205 14.0468 3.60481 14.1219C3.60757 14.197 3.59552 14.2718 3.56934 14.3422C3.54316 14.4126 3.50338 14.4772 3.45225 14.5322C3.40112 14.5873 3.33966 14.6317 3.27136 14.663C3.20307 14.6942 3.12928 14.7118 3.05421 14.7145C2.90261 14.7201 2.75501 14.6652 2.64387 14.5619L0.182931 12.2762C0.125233 12.2228 0.0792037 12.1579 0.0477258 12.0858C0.0162479 12.0137 0 11.9359 0 11.8572C0 11.7785 0.0162479 11.7007 0.0477258 11.6286C0.0792037 11.5565 0.125233 11.4916 0.182931 11.4382L2.64387 9.15245C2.6989 9.10142 2.76344 9.06172 2.83381 9.03564C2.90418 9.00955 2.979 8.99758 3.05399 9.00041C3.12899 9.00324 3.20269 9.02081 3.27089 9.05213C3.3391 9.08345 3.40046 9.12789 3.45149 9.18293ZM6.48309 9.99054C6.42806 9.93952 6.38362 9.87815 6.35231 9.80995C6.32099 9.74174 6.30342 9.66804 6.30059 9.59305C6.29488 9.44159 6.34956 9.29407 6.45262 9.18293C6.55567 9.07179 6.69865 9.00614 6.85011 9.00043C7.00157 8.99471 7.14909 9.0494 7.26023 9.15245L9.72193 11.4382C9.77963 11.4916 9.82566 11.5565 9.85714 11.6286C9.88862 11.7007 9.90487 11.7785 9.90487 11.8572C9.90487 11.9359 9.88862 12.0137 9.85714 12.0858C9.82566 12.1579 9.77963 12.2228 9.72193 12.2762L7.26099 14.5619C7.14986 14.6651 7.00229 14.7199 6.85076 14.7142C6.69923 14.7086 6.55615 14.643 6.453 14.5319C6.34984 14.4207 6.29506 14.2732 6.3007 14.1216C6.30635 13.9701 6.37195 13.827 6.48309 13.7239L8.49375 11.8572L6.48309 9.99054Z" fill="#7D7D7D" />
                                        </svg>
                                        <div className="text-xs sm:text-sm text-muted-foreground">
                                            {(offer.files_count && offer.lines_count) &&
                                                <p>{offer.files_count} files, {offer.lines_count} lines of code</p>
                                                || <div className="flex gap-x-2 items-baseline">
                                                    <p>Analyzing</p>
                                                    <span className="w-1 h-1 bg-gray-500  rounded-full animate-pulse"></span>
                                                    <span className="w-1 h-1 bg-gray-500  rounded-full animate-pulse"></span>
                                                    <span className="w-1 h-1 bg-gray-500  rounded-full animate-pulse"></span>
                                                </div>
                                            }
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-4 sm:gap-y-0 text-sm sm:text-base text-justify sm:text-pretty pb-2">
                    <div className="flex gap-2 pb-2 sm:hidden">
                        <Badge onClick={(e) => { e.stopPropagation() }} className={cn('z-50 cursor-pointer font-normal sm:hidden', offer.type == 'security' ? 'bg-orange text-white' : 'bg-blue-500 text-white')} variant='secondary' key={offer.type}>{offer.type}</Badge>

                        {offer.badges.map(badge => (
                            <Badge className='font-normal sm:hidden' variant='secondary' key={badge}>{badge}</Badge>
                        ))}
                    </div>
                    {offer.description}
                    <p className="self-end text-muted-foreground block sm:hidden text-xs">
                        {Number(offer.budget) == 0 ?
                            "Free" :
                            "Estimated payout" + USDollar.format(Number(offer.budget))
                        }
                    </p>
                </CardContent>
            </Card>
        </Link>
    )
}