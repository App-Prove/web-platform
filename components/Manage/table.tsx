'use client'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { XIcon } from "lucide-react"
import { Button } from "../ui/button"
import { useCallback } from "react"
import { createClient } from "@/utils/supabase/clients"
import Link from "next/link"

export default function ManageTable({ offerList }: { offerList: Offer[] }) {
    const deleteOffer = useCallback((id: number) => async () => {
        console.log('delete offer', id)
        // delete offer
        const supabase = createClient()
        const { data, error } = await supabase.from('offers').delete().eq('id', id).select()
        if (error) {
            console.error(error)
        }
        console.log(data)
        // reload page
        location.reload()
    }
        , [])
    return (
        <Table>
            <TableCaption>{offerList.length === 0 ? <div className="flex justify-center items-center">
                <p>
                    You don&apos;t have any listed offer
                </p><Link href={'publish'}><Button variant={'link'}>publish now</Button></Link>
            </div> : "List of all your offers"}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Repository</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Audit type</TableHead>
                    <TableHead className="text-right">Cancel</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {offerList.map((offer, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{offer.url}</TableCell>
                        <TableCell>{offer.paymentStatus}</TableCell>
                        <TableCell>{offer.type}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end items-center">
                                <Button variant={'ghost'} onClick={deleteOffer(offer.id)}>
                                    <XIcon className="flex slef-end"></XIcon>
                                </Button>
                            </div>

                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

}