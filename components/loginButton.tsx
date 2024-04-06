"use client"
import { Button } from "@/components/ui/button";
import { Github } from 'lucide-react';
import React from "react";
import { ReloadIcon } from "@radix-ui/react-icons"
import { githubLogin } from "./server/action";
export default function LoginButton() {
  const [loading, setLoading] = React.useState(false)
  return (
    <form className="">
          <Button disabled={loading} onClick={() => {
            setLoading(true)
            githubLogin()
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
  )
}