import { whyte } from '@/app/fonts'
import { cn } from '@/lib/utils'
import { CheckIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

const tiers = [
  {
    name: 'One-time audit',
    id: 'tier-one-time',
    href: '/publish?offer=one-time-audit',
    price: '$49',
    yearly: false,
    description: 'One time audit of your website, with a detailed report led by our team of experts, enhanced by our analysis tools',
    features: ['1 audit - either security or reliability', 'Any project size - single repository', 'Results within 2-3 weeks'],
  },
  {
    name: 'Yearly follow-up',
    id: 'tier-yearly',
    href: '/publish?offer=yearly-follow-up',
    price: '$500',
    yearly: true,
    description: 'Yearly follow-up of your app security or reliability, with a dedicated team of independent auditors',
    features: [
      '5 independent auditors',
      'Audit with 3 revisions in case of code changes',
      'Blockchain registered certification',
      '48-hour, dedicated support response time',
      'Private chat with auditors',
    ],
  },
]

export default function PricingTiers() {
  return (
    <div className="isolate overflow-hidden ">
      <div className="mx-auto max-w-7xl px-6 pb-96 pt-24 text-center sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-base font-semibold leading-7 text-orange-400">Pricing</h2>
          <p className={cn("mt-2 text-4xl tracking-tight text-black sm:text-5xl", whyte.className)}>
            The right price for you, <br className="hidden sm:inline lg:hidden" />
            whoever you are
          </p>
        </div>
        <div className="relative mt-6">
          <svg
            viewBox="0 0 1208 1024"
            className="absolute -top-10 left-1/2 -z-10 h-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-12 xl:top-0"
          >
            <ellipse cx={604} cy={512} rx={604} ry={512} fill="url(#6d1bd035-0dd1-437e-93fa-59d316231eb0)" />
            <defs>
              <radialGradient id="6d1bd035-0dd1-437e-93fa-59d316231eb0">
                <stop stopColor="orange" />
                <stop offset={1} stopColor="orange" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="flow-root bg-white pb-24 sm:pb-32">
        <div className="-mt-80">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10"
                >
                  <div>
                    <h3 id={tier.id} className="text-base font-semibold leading-7 text-orange-600">
                      {tier.name}
                    </h3>
                    <div className="mt-4 flex items-baseline gap-x-2">
                      <span className="text-5xl font-bold tracking-tight text-gray-900">{tier.price}</span>
                      {
                        tier.yearly?
                      <span className="text-base font-semibold leading-7 text-gray-600">/year</span>
                      :
                      <span className="text-base font-semibold leading-7 text-gray-600">single payment</span>
                      }
                    </div>
                    <p className="mt-6 text-base leading-7 text-gray-600">{tier.description}</p>
                    <ul role="list" className="mt-10 space-y-4 text-sm leading-6 text-gray-600">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3 text-left">
                          <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-orange-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={tier.href}
                    aria-describedby={tier.id}
                    className="mt-8 block rounded-md bg-orange-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                  >
                    Create an offer
                  </Link>
                </div>
              ))}
              <div className="flex flex-col items-center gap-x-8 gap-y-6 rounded-3xl p-8 ring-1 ring-gray-900/10 sm:gap-y-10 sm:p-10 lg:col-span-2 lg:flex-row lg:items-center">
                <div className="lg:min-w-0 lg:flex-1">
                  <h3 className="text-lg font-semibold leading-8 tracking-tight text-orange-600">Discounted</h3>
                  <p className="mt-1 text-base leading-7 text-gray-600">
                    Schools, students and startups can get discounted audits. We are here to help people start their audit journey.
                  </p>
                </div>
                <a
                  href='mailto:discount@app-prove.com'
                  className="rounded-md px-3.5 py-2 text-sm font-semibold leading-6 text-orange-600 ring-1 ring-inset ring-orange-200 hover:ring-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                >
                  Contact us <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
