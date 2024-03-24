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

export default  function AuthButton({user}:{user:any}) {
    return (
        <>
            {!user ?
                <Link href="/login">
                    <Button>Login</Button>
                </Link>
                :
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src={user.user_metadata.avatar_url} />
                            <AvatarFallback>{user.user_metadata.full_name.split(' ').map((name: any[]) => name[0]).join('')}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem><form><Button formAction={logout} variant="destructive">Sign Out</Button></form></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            }
        </>
    );
}