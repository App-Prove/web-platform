'use server'
import { getWebsiteURL } from "@/lib/utils"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'


export async function logout() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  redirect('/')
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

  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: redirectUrl ? `${getWebsiteURL()}${redirectUrl}` : `${getWebsiteURL()}auth/callback/`,
    },
  })

  if (data.url) {
    redirect(data.url) // use the redirect API for your server framework
  }

}

export async function emailLogin(redirectUrl: string | null = null, email: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOtp({ email: email })
  console.log(data)
    console.log(error)
  if (error) {
    redirect('/error')
  }

  if (redirectUrl) {
    redirect(redirectUrl)
  }
}

export async function verifyOTP(email:string, token:string){
  console.log('Verifying OTP')
  const supabase = createClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })
  console.log(session)
  console.log(error)

}