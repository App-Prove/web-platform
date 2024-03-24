"use client"
import { Button } from "@/components/ui/button";
import { githubLogin, login, signup } from './actions'
import { Github } from 'lucide-react';

export default function LoginPage() {
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
          <Button formAction={githubLogin}><Github/>Sign in with Github</Button>
        </div>
      </div>
    </form>
  )
}