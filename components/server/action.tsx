'use server'
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'


export async function logout() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
}


export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)
  console.log(error)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function githubLogin(redirectUrl: string | null = null) {
  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      'http://localhost:3000/'
    // Make sure to include `https://` when not localhost.
    url = url.startsWith('http') ? url : `https://${url}`
    // Make sure to include a trailing `/`.
    url = url.endsWith('/') ? url : `${url}/`
    console.log(url)
    return url
  }

  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: redirectUrl ? `${getURL()}${redirectUrl}` : `${getURL()}auth/callback/`,
    },
  })

  if (data.url) {
    redirect(data.url) // use the redirect API for your server framework
  }

}