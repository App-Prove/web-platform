import Link from "next/link";

export default function SurveyErrorPage(){
    return(
        <div className="text-center w-full">
        <p className="text-base font-semibold text-orange">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Ooooops</h1>
        <p className="mt-6 text-base leading-7 text-gray-600">Sorry there has been an error while submitting </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/survey"
            className="rounded-md bg-orange px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Try again
          </Link>
          <Link href="/contact" className="text-sm font-semibold text-gray-900">
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    )
}