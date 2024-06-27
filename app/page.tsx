'use client'
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { whyte } from "./fonts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import ReliabilityCertification from "@/components/Certifications/ReliabilityCertification";
import SecurityCertification from "@/components/Certifications/SecurityCertification";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      setError(urlParams.get('error'));
    }
  }, []);

  useEffect(() => {
    if (error) {
      console.log(error)
      toast({
        title: 'Hey there! 🚀',
        description: 'You have to be logged in to access this page, please hit sign-in button, and log through your github account!'
      })
    }
  }, [error]);


  return (
    <div className="min-h-full mb-24 w-full overflow-visible">
      <Toaster />
      <div className="flex flex-col h-[80vh] sm:h-[100svh] relative overflow-visible justify-center ">
          <div className="mx-auto flex mb-4 sm:mb-8 sm:flex sm:justify-center">
            <Link href="survey" className="relative rounded-full px-3 py-1 text-xs sm:text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              We are leading a <span className="text-orange underline">survey</span> to better understand your needs.{' '}
            </Link>
          </div>
        <h1 className={cn("text-5xl font-medium text-center", whyte.className)}>
          IS YOUR APP
          <strong className="text-orange"> SECURE?</strong>
        </h1>
        <p className="mt-2 text-lg text-center text-muted-foreground">
          App-Prove enhances code <strong>security</strong> and <strong>reliability</strong> with audits conducted by <strong>independent</strong> developers and advanced algorithms
        </p>

        <div className={cn("flex sm:gap-x-6 gap-x-2 gap-y-2 mt-8 flex-wrap justify-center")}>
          <Link href="publish">
            <Button className="bg-orange">Publish your project</Button>
          </Link>
          <Link href="profile">
            <Button variant="secondary">Earn money as auditor</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-12 text-center">
        <div className="flex flex-col gap-2">
          <h2 className={cn("uppercase text-3xl font-medium", whyte.className)}>Help people <strong className="text-orange">trust</strong> your code</h2>
          <p className={cn("text-muted-foreground")} >Developers encounter many difficulties when it comes to having their code audited</p>
          <ul className="flex gap-4 flex-col pl-6 self-center text-left list-disc">
            <li>Limited existing solution</li>
            <li>Expensive</li>
            <li>Audit insecurity</li>
            <li>Lack of transparency</li>
          </ul>
        </div>
        <Separator />
        <div className="flex flex-col">
          <h3 className={cn("uppercase text-3xl font-medium flex gap-2 flex-wrap justify-center", whyte.className)}>
            <strong className="text-orange"> Prove </strong>your
            <div>
              App
            </div>
            <div className="[text-wrap:balance] bg-clip-text text-transparent">
              <span className="text-orange inline-flex flex-col h-[calc(theme(fontSize.3xl)*theme(lineHeight.tight))] overflow-hidden">
                <ul className="block animate-text-slide-2 text-left leading-tight [&_li]:block">
                  <li><strong>security</strong></li>
                  <li><strong className="text-blue-500"> reliability</strong></li>

                  <li aria-hidden="true"><strong>security</strong></li>
                </ul>
              </span>
            </div>
          </h3>
          <div className="self-center justify-center flex overflow-visible flex-wrap sm:justify-start">
            <SecurityCertification></SecurityCertification>
            <ReliabilityCertification></ReliabilityCertification>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <h2 className={cn("uppercase text-3xl font-medium", whyte.className)}>Audit platform with full <strong className="text-orange">transparency</strong></h2>
          <p className={cn("text-muted-foreground text-pretty")} >
            A platform prioritizing exchange with experts tailored to your needs through the publication of your personalized offer.
            <br />
            <br />
            Furthermore, the platform is completely transparent regarding how money is shared among parties.
          </p>
          <div className="flex justify-center flex-col text-center">
            <div className="flex overflow-hidden justify-center">
              <svg width="816" height="429" viewBox="0 0 816 429" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 398.333C40 395.545 40 394.151 40.2306 392.992C41.1775 388.232 44.8986 384.51 49.6589 383.564C50.8181 383.333 52.2121 383.333 55 383.333H113C115.788 383.333 117.182 383.333 118.341 383.564C123.101 384.51 126.823 388.232 127.769 392.992C128 394.151 128 395.545 128 398.333H40Z" fill="#FF4003" />
                <rect x="40" y="398.333" width="88" height="15" fill="#FF4003" />
                <rect x="40" y="413.333" width="88" height="15" fill="#FF4003" />
                <path d="M384 19.2C384 12.4794 384 9.11905 385.308 6.55211C386.458 4.29417 388.294 2.4584 390.552 1.30792C393.119 0 396.479 0 403.2 0H452.8C459.521 0 462.881 0 465.448 1.30792C467.706 2.4584 469.542 4.29417 470.692 6.55211C472 9.11905 472 12.4794 472 19.2V125.111H384V19.2Z" fill="black" fillOpacity="0.2" />
                <rect x="384" y="125.111" width="88" height="15" fill="#747474" />
                <rect x="384" y="144.111" width="88" height="125.111" fill="#090909" />
                <rect x="384" y="269.222" width="88" height="15" fill="#FF4003" />
                <rect x="384" y="288.222" width="88" height="125.111" fill="#090909" />
                <rect x="384" y="413.333" width="88" height="15" fill="#FF4003" />
                <path d="M728 19.2C728 12.4794 728 9.11905 729.308 6.55211C730.458 4.29417 732.294 2.4584 734.552 1.30792C737.119 0 740.479 0 747.2 0H796.8C803.521 0 806.881 0 809.448 1.30792C811.706 2.4584 813.542 4.29417 814.692 6.55211C816 9.11905 816 12.4794 816 19.2V140.111H728V19.2Z" fill="#090909" />
                <rect x="728" y="144.111" width="88" height="140.111" fill="#090909" />
                <rect x="728" y="288.222" width="88" height="140.111" fill="#090909" />
              </svg>
            </div>
            <div className="flex gap-x-4 mt-4">
              <h3 className={cn(whyte.className, "font-bold text-5xl text-orange")}>&lt;20%</h3>
              <p className="text-muted-foreground">revenue shared for each approved* review</p>
            </div>
            <p className="text-muted-foreground text-sm mt-8 text-justify">* At the end of the audit period, our team and developers who participated, ensure reviews follow our standards</p>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <h2 className={cn("uppercase text-3xl font-medium", whyte.className)}>
            Ensure your code
            <strong className="text-orange"> security </strong>
            in 3 steps
          </h2>

          <Image src={'/steps.png'} width={1280} height={720} alt={"3 simple steps consisting in publishing, paying and receiving feedback"}></Image>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 text-left">
          <h2 className={cn("uppercase text-3xl font-medium text-center", whyte.className)}>
            Questions &
            <strong className="text-orange"> Answers </strong>
          </h2>
          <Accordion type="multiple">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is App-Prove?</AccordionTrigger>
              <AccordionContent>
                App-Prove is a web platform designed for developers to find auditors who can review their code for flaws and vulnerabilities.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How does App-Prove work ?</AccordionTrigger>
              <AccordionContent>
                Developers can submit their code to the platform, where auditors thoroughly examine it for any potential weaknesses. This ensures that the code meets high standards of security and reliability.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Why is App-Prove important ?</AccordionTrigger>
              <AccordionContent>
                App-Prove helps developers ensure the integrity of their code by providing access to skilled auditors who can identify and address vulnerabilities. This is crucial for maintaining the security of software systems and protecting against cyber threats.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How much does it cost ?</AccordionTrigger>
              <AccordionContent>
                If you want to publish an offer, you choose how much it costs for your audit. If you want to audit, it costs you absolutely nothing, it is the opposite: you can earn money!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>How do App-Prove make money ?</AccordionTrigger>
              <AccordionContent>
                Upon completion of the audit offer, a portion of the money is paid to App-Prove as a commission, and the rest of the money is divided fairly among all auditors.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>What is an auditor ?</AccordionTrigger>
              <AccordionContent>
                An auditor is a person responsible for checking and verifying your code and/or program.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger>Who can publish an offer ?</AccordionTrigger>
              <AccordionContent>
                Whether you are a freelancer, a self-employed individual, or part of a company, you can publish an offer by completing a form to provide the details of your offer.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger>How to publish an offer ?</AccordionTrigger>
              <AccordionContent>
                Simply log in to our platform using a GitHub account, then all you have to do is click on the &apos;Publish&apos; button, fill out the form, and finally make the payment.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">

            </h2>
            <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
              <img
                className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                src="/euratechnologies.png"
                alt="Euratechnologies"
                width={158}
                height={48}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h2 className={cn("font-medium text-3xl", whyte.className)}>Try our platform now!</h2>
          <p className="text-center text-muted-foreground">
            Publish your offer in less than 5 minutes through our platform or become an auditor to get rewarded for your knowledge
          </p>
          <div className="flex sm:gap-x-6 gap-x-2 gap-y-2 mt-8 flex-wrap">
            <Link href="publish">
              <Button className="bg-orange">Publish your project</Button>
            </Link>
            <Link href="profile">
              <Button variant="secondary">Earn money</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
