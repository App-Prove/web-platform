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
import { logout } from "./server/action"
import { Github } from 'lucide-react';
import React from "react";
import { ReloadIcon } from "@radix-ui/react-icons"
import { githubLogin } from "./server/action";
import { redirect, usePathname, useSearchParams } from "next/navigation";

export default function AuthButton({ user }: { user: any }) {
    // Check if there is a code in the URL
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const code = searchParams.get('code')
    if (code) {
        // If there is a code, we call auth/callback to exchange it for a session
        // and then redirect to start page
        redirect(`/auth/callback?code=${code}&next=${pathname}/`)
    }
    const [loading, setLoading] = React.useState(false)
    return (
        <>
            {!user ?
                <form className="">
                    <Button
                        disabled={loading}
                        onClick={() => {
                            setLoading(true)
                            githubLogin(pathname)
                        }}>
                        {!loading ?
                            <>
                                <Github />
                                <p>Sign in</p>
                            </>
                            :
                            <>
                                <ReloadIcon className="sm:mr-2 h-4 w-4 animate-spin" />
                                <p className="hidden sm:block">Please wait</p>
                            </>
                        }
                    </Button>
                </form>
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
                        <DropdownMenuItem asChild><Link href={process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL??''}>Billing</Link></DropdownMenuItem>
                        <DropdownMenuLabel>My offers</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link href='manage'>Manage</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href='publish'>Publish</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><form><Button formAction={logout} variant="destructive">Sign Out</Button></form></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            }
        </>
    );
}