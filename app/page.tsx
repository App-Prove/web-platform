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
import { githubLogin } from "@/components/server/action";
import { Github } from "lucide-react";
import PricingTiers from "@/components/PricingTiers";

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
        description: 'You have to log through your github account to access this page!',
        action: <Button onClick={() => githubLogin()}>
          <Github />
          <p>Sign in</p>
        </Button>
      })
    }
  }, [error]);


  return (
    <div className="min-h-full mb-24 w-full overflow-visible">
      <Toaster />
      <div className="flex flex-col h-[80vh] sm:h-[100svh] relative overflow-visible justify-center ">
        <div className="mx-auto flex mb-4 sm:mb-8 sm:flex sm:justify-center">
          <Link href="survey" className="relative rounded-full px-2 py-1 text-xs sm:text-sm text-center leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            Your feedback matters. Take our <span className="text-orange underline">survey</span>.
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
          <Link href="#pricing">
            <Button className="bg-orange">Publish your project</Button>
          </Link>
          <Link href="profile">
            <Button variant="secondary">Earn money as auditor</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-12 text-center">
        <div className="flex flex-col gap-2">
          <h2 className={cn(" text-3xl", whyte.className)}>Help people <strong className="text-orange">trust</strong> your code</h2>
          <p className={cn("text-muted-foreground")} >Developers encounter many difficulties when it comes to having their code audited</p>
          <p className={cn("", whyte.className)} >App-Prove is here to:</p>
          <ul className="flex gap-4 flex-col pl-6 self-center text-center list-none font-bold text-orange">
            <li>offer affordable code audits</li>
            <li>make the audit process clear</li>
            <li>support all programming languages</li>
          </ul>

        </div>
        <Separator />
        <div className="flex flex-col">
          <h3 className={cn("text-3xl gap-2 flex-wrap justify-center flex", whyte.className)}>
            Earn certifications to
            <strong className="text-orange"> prove </strong>your
            <span>
              app
            </span>
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
        <section id='pricing'>
          <PricingTiers></PricingTiers>
        </section>
        <Separator />
        <div className="flex flex-col gap-2 text-left">
          <h2 className={cn("uppercase text-3xl font-medium text-center", whyte.className)}>
            Questions &
            <strong className="text-orange"> Answers </strong>
          </h2>
          <Accordion type="multiple" defaultValue={[
            "item-1",
            "item-2",
            "item-3",
            "item-4",
            "item-5",
            "item-6",
            "item-7",
            "item-8",
            "item-9",
            "item-10",
          ]}>
            <AccordionItem value="item-1">
              <AccordionTrigger>What is App-Prove?</AccordionTrigger>
              <AccordionContent >
                App-Prove is a web platform designed for developers to find auditors who can review their code for flaws and vulnerabilities.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Why is App-Prove important ?</AccordionTrigger>
              <AccordionContent>
                App-Prove helps developers ensure the integrity of their code by providing access to skilled auditors who can identify and address vulnerabilities. This is crucial for maintaining the security of software systems and protecting against cyber threats.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How does App-Prove work ?</AccordionTrigger>
              <AccordionContent>
                Developers can submit their open-source code from GitHub to our platform, where auditors thoroughly examine it for any potential weaknesses. This ensures that the code meets high standards of security and reliability. At the end of the audit, the app creator will be able to obtain a certificate depending on the type of audit chosen at the creation of the offer.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What types of audits are available?</AccordionTrigger>
              <AccordionContent>
                Currently, 2 types of audits are available.
                The first one is the security audit which allows to check if it has no data breach.
                The second one is the reliability audit which allows to check if there are no bugs in the code.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>What is an auditor ?</AccordionTrigger>
              <AccordionContent>
                An auditor is a person responsible for checking and verifying your code and/or program.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>Who can publish an offer ?</AccordionTrigger>
              <AccordionContent>
                Whether you are a freelancer, a self-employed individual, or part of a company, you can publish an offer by completing a form to provide the details of your offer.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger>How to publish an offer ?</AccordionTrigger>
              <AccordionContent>
                Simply log in to our platform using a GitHub account, then all you have to do is click on the &apos;Publish&apos; button, fill out the form.
                Then you will have an interface that will make a pre-analysis of your code to give you a first assessment and finally you make the payment.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger>How to audit an offer ?</AccordionTrigger>
              <AccordionContent>
                Simply log in to our platform using a GitHub account, then you have to click on the &apos;Offers&apos; button and click on the offer you are interested in, after that you need to click on the &apos;Participate&apos; button.
                Then you can audit code by forking the repository, making your changes, and then submitting a pull request to the main project. Our algorithms will then analyze your pull request, check your code, and provide feedback. We&apos;ll then see if you meet the criteria to be eligible for a payout.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-9">
              <AccordionTrigger>How much does it cost ?</AccordionTrigger>
              <AccordionContent>
                If you want to publish an offer, you need to pay an annual subscription of 500$ to have access to an audit and 3 proofreading.
                If you want to audit, it costs you absolutely nothing, it is the opposite: you can earn money !
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-10">
              <AccordionTrigger>How does App-Prove make money ?</AccordionTrigger>
              <AccordionContent>
                Some of the subscription money will be distributed to auditors, and App-Prove will recover the remaining money in order to sustain platform development.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <h2 className={cn("font-medium text-3xl", whyte.className)}>
              Part of <strong className="text-orange">well-known</strong> incubator programs
            </h2>
            <div className="mx-auto mt-10 grid grid-cols-1 items-start gap-x-8 gap-y-10 sm:grid-cols-2 sm:gap-x-10">
              <Link href="https://hdf.campuscyber.fr/">
                <img
                  className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                  src="/logo-campus-cyber.png"
                  alt="Campus Cyber"
                  width={158}
                  height={48}
                />
              </Link>
              <Link href="https://www.euratechnologies.com/en">
                <img
                  className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                  src="/logo-euratechnologies.svg"
                  alt="Euratechnologies"
                  width={158}
                  height={48}
                />
              </Link>
            </div>
          </div>
        </div>
        <Separator />
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
