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

export default function OffersPage() {
    const resultNumber = 10;
    const offers = [
        {
            url: "steinprograms",
            title: "SteinPrograms",
            badges: ["C++", "Python", "API", "Trading"],
            description: "Evolving in the trading sector, we are developing robust software in C++. Our software needs to be reliable and verified by different entities to ensure extreme reliability.",
            budget: '1 000$',

        },
        {
            url: "codeshield",
            title: "CodeShield",
            badges: ["Javascript", "SQL Database"],
            description: "Working in the auditing sector, we built a web platform helping developers get their code certified and audited with ease.",
            budget: '500$',
        },
    ]
    return (
        <div className="flex gap-6 flex-col sm:flex-row">
            <div className="">
                <Input placeholder="Search keywords"></Input>
            </div>
            <div className="flex-1 flex flex-col gap-6">
                <div className="flex justify-between items-center w-full">
                    <p>{offers.length} Results</p>
                    <div className="flex gap-4 items-center">
                        <p>Sort by:</p>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Most recent" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Most recent</SelectItem>
                                <SelectItem value="views">Most viewed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {offers.map(offer => (
                    <Link key={offer.title} href={"/offers/" + offer.url}>
                        <Card className="hover:bg-gray-100 hover:border-black hover:cursor-pointer">
                            <CardHeader>
                                <div className="flex justify-between w-full">
                                    <div className="flex gap-4">
                                        <Image className="" width={64} height={64} src={"/logo-" + offer.title.toLowerCase() + ".png"} alt={"logo-" + offer.title}></Image>
                                        <div className="flex gap-2 flex-col">
                                            <div className="flex flex-col sm:flex-row">
                                            <CardTitle>{offer.title}</CardTitle>
                                            <p className="self-start sm:flex-end">{offer.budget}</p>
                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                {offer.badges.map(badge => (
                                                    <Badge key={badge}>{badge}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex items-center gap-2 sm:gap-24 justify-between flex-col sm:flex-row">
                                <CardDescription className="text-pretty">
                                    {offer.description}
                                </CardDescription>
                                <div className="text-nowrap flex gap-2 items-center self-end sm:self-auto">
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
