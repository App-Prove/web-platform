"use client"
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button, buttonVariants } from "./ui/button";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { UserAuthForm } from "./AuthForm";
import { cn } from "@/lib/utils";


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
    return (
        <>
            {!user ?
                <Dialog>
                    <DialogTrigger asChild><Button>Sign in</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Authentication</DialogTitle>
                        </DialogHeader>
                        <div className="lg:p-8 text-black">
                            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                                <div className="flex flex-col space-y-2 text-center">
                                    <h1 className="text-2xl font-semibold tracking-tight">
                                        Create an account
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        Enter your email below to create your account
                                    </p>
                                </div>
                                <UserAuthForm />
                                <p className="px-8 text-center text-sm text-muted-foreground">
                                    By clicking continue, you agree to our{" "}
                                    <Link
                                        href="/terms"
                                        className="underline underline-offset-4 hover:text-primary"
                                    >
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        href="/privacy"
                                        className="underline underline-offset-4 hover:text-primary"
                                    >
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </div>
                        </div>

                    </DialogContent>
                </Dialog>
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
                        <DropdownMenuItem asChild><Link href={process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL ?? ''}>Billing</Link></DropdownMenuItem>
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