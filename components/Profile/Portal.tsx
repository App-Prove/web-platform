'use client'
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/9JAxxZYf4oR
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import ProfileSettings from "./ProfileSettings"
import { User } from "@supabase/supabase-js"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { createClient } from "@/utils/supabase/clients"
import { toast } from "sonner"

const formSchema = z.object({
  website: z.string().url().optional(),
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 30 characters.",
    }).optional(),
    experience: z.coerce.number().optional(),
})

export default function Component({ user, profileData }: { user: User, profileData: any }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      website: profileData?.website || "",
      bio: profileData?.bio || "",
      experience: 1,
    },
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Update user profile linked to id
    const supabase = createClient()
    const { data, error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...values,
    }).eq('id', user.id).select()

    if(error) {
      console.log(error)
    }
    console.log(data)

    toast("Profile updated successfully")
    console.log(values)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
          <h2 className="text-3xl font-semibold mb-4">{user.user_metadata.name}</h2>
          <div className="flex flex-col sm:flex-row w-full gap-x-12 gap-y-4">
            <div className="flex-1 max-w-5xl flex flex-col gap-y-4">
              <div>
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="website">Website</FormLabel>
                      <FormControl>
                        <Input {...field} id="website" placeholder="https://example.com" />
                      </FormControl>
                      <FormDescription>Link to your personal website or blog.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <label htmlFor="languages" className="block text-sm font-medium text-muted-foreground">
                  Programming Languages
                </label>
                <div className="mt-1">
                  <ProfileSettings keywords={[]} />
                </div>
              </div>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col w-full">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <div className="flex items-center w-full overflow-hidden gap-x-4">
                    <FormControl>
                      <input
                        placeholder="1"
                        className="text-4xl font-bold max-w-12 text-right"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                  <span className="flex-1 text-muted-foreground">years</span>
                    </div>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </div>
      </form>
    </Form>

  )
}