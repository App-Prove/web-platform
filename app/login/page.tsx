"use client"
import { Button } from "@/components/ui/button";
import { githubLogin, login, signup } from './actions'
import { Github } from 'lucide-react';
import React from "react";
import { ReloadIcon } from "@radix-ui/react-icons"
export default function LoginPage() {
  const [loading, setLoading] = React.useState(false)
  return (
    <form className="w-full h-full items-center  justify-center flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {/* <div className="flex gap-2">
          <label htmlFor="email">Email:</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="flex gap-2">
          <label htmlFor="password">Password:</label>
          <input id="password" name="password" type="password" required />
        </div> */}
        <div className="flex gap-4">
          {/* <Button formAction={login}>Log in</Button>
          <Button formAction={signup}>Sign up</Button> */}
          <Button disabled={loading} onClick={() => {
            setLoading(true)
            githubLogin()
          }}>
            {!loading ?
              <>
                <Github />
                <p>Sign in with Github</p>
              </>
              :
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                <p>Please wait</p>
              </>
            }
          </Button>
        </div>
      </div>
    </form>
  )
}