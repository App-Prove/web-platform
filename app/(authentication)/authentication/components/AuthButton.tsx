"use client"
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from "@/components/server/action"
import { Github } from 'lucide-react';
import React from "react";
import { ReloadIcon } from "@radix-ui/react-icons"
import { githubLogin } from "@/components/server/action";
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
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";


export default function Authentication() {
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
        <Card>
            <CardHeader>
                <CardTitle className="text-black dark:text-white">Authentication</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="lg:p-8 text-black dark:text-white">
                                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                                <div className="flex flex-col space-y-2 text-center">
                                    <h1 className="text-2xl font-semibold tracking-tight">
                                        Create an account
                                    </h1>
                                    <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                                        Enter your email below to create your account
                                    </p>
                                </div>
                                <UserAuthForm />
                                <p className="px-8 text-center text-sm text-muted-foreground dark:text-muted-foreground-dark">
                                    By clicking continue, you agree to our{" "}
                                    <Link
                                        href="/terms"
                                        className="underline underline-offset-4 hover:text-primary dark:hover:text-primary-dark"
                                    >
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        href="/privacy"
                                        className="underline underline-offset-4 hover:text-primary dark:hover:text-primary-dark"
                                    >
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
    )
}
