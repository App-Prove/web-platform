import localFont from 'next/font/local'
import { Poppins } from "next/font/google";

export const whyte = localFont({
    src: './Whyte.woff2',
})

export const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});