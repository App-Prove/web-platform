'use client'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function SearchBar(){
  const [open, setOpen] = useState(false);
  const commandRef = useRef<HTMLDivElement>(null);

    return(
        <div className="relative" ref={commandRef}>
          <Command>
            <CommandInput 
              placeholder="What are you looking for?" 
              onClick={() => setOpen(true)} 
              onFocus={() => setOpen(true)} 
            />
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 w-full"
                >
                  <CommandList className="bg-background border shadow-lg">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      <CommandItem>SQL Injections</CommandItem>
                      <CommandItem>XSS</CommandItem>
                      <CommandItem>CORS</CommandItem>
                      <CommandItem>Partitioning</CommandItem>
                    </CommandGroup>
                  </CommandList>
                </motion.div>
              )}
            </AnimatePresence>
          </Command>
        </div>
    )
}