"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { emailLogin, githubLogin, verifyOTP } from "@/components/server/action"
import { usePathname } from "next/navigation"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { set } from "date-fns"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from "sonner"

const EmailFormSchema = z.object({
  email: z.string().email({
    message: "Please provide a valid email.",
  })
})

const OTPFormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [OTPDisabled, setOTPDisabled] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState<string>("")
  const [emailSent, setEmailSent] = React.useState<boolean>(false)
  const pathname = usePathname()

  const emailForm = useForm<z.infer<typeof EmailFormSchema>>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      email: "",
    },
  })
  const OTPForm = useForm<z.infer<typeof OTPFormSchema>>({
    resolver: zodResolver(OTPFormSchema),
    defaultValues: {
      pin: "",
    },
  })
  async function onOTPSubmit(data: z.infer<typeof OTPFormSchema>) {
    await verifyOTP(email, data.pin)
  }
  async function onEmailSubmit(data: z.infer<typeof EmailFormSchema>) {
    setIsLoading(true)
    await emailLogin(pathname, data.email)
    setIsLoading(false)
    setEmailSent(true)
    setEmail(data.email)

  }

  return (
    <div className={cn("grid gap-6", className, " dark:text-white")} {...props}>
      <Form {...emailForm} >
        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="w-full flex-1 flex flex-col sm:flex-row gap-2">
          <FormField
            control={emailForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <FormLabel className="sr-only" htmlFor="email">
                      Email
                    </FormLabel>
                    <FormControl
                    >
                      <Input id="email"
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={isLoading} {...field} />
                    </FormControl>
                  </div>
                  <Button disabled={isLoading} type="submit" className="dark:bg-orange dark:text-white  hover:dark:bg-orange/50 hover:dark:text-white">
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign in with Email
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form >
      </Form >
      {emailSent &&
        <Form {...OTPForm}>
        <form onSubmit={OTPForm.handleSubmit(onOTPSubmit)}>
          <FormField
            control={OTPForm.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP className="w-full" maxLength={6} {...field} onChange={(value) => {
                      field.onChange(value);
                      if (value.length === 6) {
                        console.log("submitting");
                        OTPForm.handleSubmit(onOTPSubmit)();
                      }
                    }}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription className="dark:text-gray-400">
                  Please enter the one-time password sent to your mail.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      }
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading} onClick={() => { setIsLoading(true); githubLogin(pathname) }} className="dark:bg-gray-700 dark:text-white dark:border-gray-600 hover:dark:bg-gray-600 hover:dark:text-white">
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        GitHub
      </Button>
    </div >
  )
}
