import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getAPIURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_API_URL ?? // Set this to your site URL in production env.
      'http://localhost:8000/'
    // Make sure to include `https://` when not localhost.
    url = url.startsWith('http') ? url : `https://${url}`
    // Make sure to include a trailing `/`.
    url = url.endsWith('/') ? url : `${url}/`
    console.log(url)
    return url
  }

export  const getWebsiteURL = () => {
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

export function formatOffers(data: any) : Offer[]{
    // Data is an array of objects (offers)
    return data.map((offer: any) => {
        return {
            id: offer.id,
            url: offer.url,
            paymentStatus: offer.payment_status,
            keywords: offer.keywords?.split(','),
            description: offer.description,
            type: offer.type,
            owner: offer.owner,
            lines_count: offer.lines_count,
            files_count: offer.files_count,
        } as Offer;
    })
}

