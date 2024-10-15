import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { logout } from "@/components/server/action"

export default function UserMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Card className="cursor-pointer border-[#DEDEE8] bg-gradient-to-b from-white to-[#F8FAFB] dark:border-[#4B5563] dark:bg-gradient-to-b dark:from-[#1F2937] dark:to-[#374151] rounded-xl">
                    <CardContent className="flex p-2 items-center gap-x-2 h-16 justify-between">
                        <div className="relative items-center w-12 h-12 flex-shrink-0">
                            <Image src={"/user.png"} alt={"user avatar"} height={64} width={64} className="rounded-sm h-12 w-12"></Image>
                            <Image src={"/company.png"} alt={"company logo"} height={64} width={64} className="rounded-[2px] ring-1 ring-white absolute h-3 w-3 right-0 bottom-0 bg-white"></Image>
                        </div>
                        <div className="flex flex-col justify-around text-xs">
                            <h2 className="text-black dark:text-white">User Name</h2>
                            <a href="mailto:user@email.com" className="text-muted-foreground dark:text-muted-foreground-dark">user@email.com</a>
                        </div>
                        <div>
                            <ChevronDown className="h-4 w-4"></ChevronDown>
                        </div>
                    </CardContent>
                </Card>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[252px] bg-white dark:bg-gray-800">
                <DropdownMenuLabel className="text-black dark:text-white">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span className="text-black dark:text-white">Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span className="text-black dark:text-white">Billing</span>
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span className="text-black dark:text-white">Settings</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Keyboard className="mr-2 h-4 w-4" />
                        <span className="text-black dark:text-white">Keyboard shortcuts</span>
                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        <span className="text-black dark:text-white">Team</span>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span className="text-black dark:text-white">Invite users</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    <span className="text-black dark:text-white">Email</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    <span className="text-black dark:text-white">Message</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    <span className="text-black dark:text-white">More...</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem>
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="text-black dark:text-white">New Team</span>
                        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Github className="mr-2 h-4 w-4" />
                    <span className="text-black dark:text-white">GitHub</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span className="text-black dark:text-white">Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                    <Cloud className="mr-2 h-4 w-4" />
                    <span className="text-black dark:text-white">API</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => {
                    await logout()
                }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="text-black dark:text-white">Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
