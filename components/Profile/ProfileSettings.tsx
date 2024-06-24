'use client'
import { Label } from "@radix-ui/react-dropdown-menu";
import { CommandList, CommandEmpty, CommandGroup, CommandItem, CommandInput } from "cmdk";
import React, { useRef } from "react";
import { Command, CommandShortcut } from "../ui/command";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

export default function ProfileSettings({keywords}: {keywords: Keyword[]}){
    const [selected, setSelected] = React.useState<Keyword[]>([]);
    const [inputValue, setInputValue] = React.useState("");
    const selectables = keywords.filter(keyword => !selected.includes(keyword));
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    return(
            <div className="grid w-full gap-1.5">
                <Command onKeyDown={async (e) => {
                    const input = inputRef.current
                    if (input) {
                        if (e.key === "Delete" || e.key === "Backspace") {
                            // If we want to delete the last keyword
                            if (input.value === "") {
                                // Remove the last keyword from selected
                                setSelected(prev => {
                                    const newSelected = [...prev];
                                    newSelected.pop();
                                    return newSelected;
                                })
                            }
                        }
                        // This is not a default behaviour of the <input /> field
                        if (e.key === "Escape") {
                            input.blur();
                        }
                    }
                    // What happens if there is nothing in selectables?
                    console.log('selectables', selectables)
                }
                }
                    className="overflow-visible bg-transparent">
                    <div
                        className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                    >
                        <div className="flex gap-1 flex-wrap">
                            {
                                // This is the list of selected keywords
                                // Displays a badge for each keyword
                                // Can't be undefined
                                selected.map((keyword) => {
                                    return (
                                        <Badge key={keyword.value} variant="secondary">
                                            {keyword.label}
                                            <button
                                                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        setSelected(prev => prev.filter(s => s.value !== keyword.value));
                                                    }
                                                }}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                                onClick={() => {
                                                    setSelected(prev => prev.filter(s => s.value !== keyword.value));
                                                }
                                                }
                                            >
                                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                            </button>
                                        </Badge>
                                    )
                                })}
                            {/* Avoid having the "Search" Icon */}
                            <CommandInput
                                ref={inputRef}
                                value={inputValue}
                                onValueChange={setInputValue}
                                onBlur={() => setOpen(false)}
                                onFocus={() => setOpen(true)}
                                placeholder="Select your programming skills"
                                className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1 text-base w-full"
                            />
                        </div>
                    </div>
                    <div className="relative mt-2">
                        {open ?
                            <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                                <CommandList>
                                    <CommandEmpty>No results found. Press <CommandShortcut>spacebar</CommandShortcut> to add new</CommandEmpty>
                                    {
                                        selectables.length > 0 ?
                                            <CommandGroup className="h-full overflow-auto">
                                                {
                                                    // This is the list of keywords that can be selected
                                                    selectables.map((keyword) => {
                                                        return (
                                                            <CommandItem
                                                                key={keyword.value}
                                                                onMouseDown={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                }}
                                                                onSelect={(value) => {
                                                                    setInputValue("")
                                                                    setSelected(prev => [...prev, keyword])
                                                                }}
                                                                className={"cursor-pointer px-2"}
                                                            >
                                                                {keyword.label}
                                                            </CommandItem>
                                                        );
                                                    })}
                                            </CommandGroup>
                                            :
                                            null
                                    }
                                </CommandList>
                            </div>
                            : null}
                    </div>
                </Command >
            </div>

    )
}