"use client"
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {logout} from "./server/action"
import LoginButton from "./loginButton";

export default  function AuthButton({user}:{user:any}) {
    return (
        <>
            {!user ?
                <LoginButton></LoginButton>
                :
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src={user.user_metadata.avatar_url} />
                            <AvatarFallback>{user.user_metadata.full_name?.split(' ').map((name: any[]) => name[0]).join('')}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link href='profile'>Profile</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href='billing'>Billing</Link></DropdownMenuItem>
                        <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link href='auditors'>Auditors</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href='offers'>Offers</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href='publish'>Publish an offer</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><form><Button formAction={logout} variant="destructive">Sign Out</Button></form></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            }
        </>
    );
}