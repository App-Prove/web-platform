import { BugAntIcon, ChatBubbleLeftRightIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'

export default function Contact() {
    return (
    <div className="w-full text-left isolate bg-white py-12 sm:py-4 ">
      <div className="mt-20 max-w-lg space-y-16">
        <div className="flex gap-x-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">Sales support</h3>
            <p className="mt-2 leading-7 text-gray-600">
            For any issue related to sales, please contact us. We are here to help you.
            </p>
            <p className="mt-4">
              <a href="mailto:sales@app-prove.com" className="text-sm font-semibold leading-6 text-orange">
                Contact us <span aria-hidden="true">&rarr;</span>
              </a>
            </p>
          </div>
        </div>
        <div className="flex gap-x-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange">
            <ComputerDesktopIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">Technical support</h3>
            <p className="mt-2 leading-7 text-gray-600">
            For any technical issue, feel free to join our Discord server. We are here to help you.
            </p>
            <p className="mt-4">
              <a href="#" className="text-sm font-semibold leading-6 text-orange">
                Join our Discord <span aria-hidden="true">&rarr;</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>

    )
}

