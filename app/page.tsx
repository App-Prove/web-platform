'use client'
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { whyte } from "./fonts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator";
import { Toast } from "@/components/ui/toast";
import { toast, useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

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
        description:'You have to be logged in to access this page, please hit sign-in button, and log through your github account!'
      })
    }
  }, [error]);
  return (
    <div className="min-h-full mb-24 w-full overflow-visible">
      <Toaster />
      <div className="flex flex-col h-screen relative overflow-visible justify-center ">
        <h1 className={cn("text-5xl font-medium", whyte.className)}>
          IS YOUR APP<br />
          <strong className="text-orange">SECURE?</strong>
        </h1>
        <p className="mt-2 text-lg">
          App-Prove is the <strong>best</strong> place to find <br />
          <strong>reliable</strong> auditors to certify your code
        </p>

        <div className={cn("flex sm:gap-x-6 gap-x-2 gap-y-2 mt-8 flex-wrap")}>
          <Link href="publish">
            <Button className="bg-orange">Ask feedback</Button>
          </Link>
          <Link href="profile">
            <Button variant="secondary">Become an auditor</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <h2 className={cn("uppercase text-3xl font-medium", whyte.className)}>Help people <strong className="text-orange">trust</strong> your code</h2>
          <p className={cn("text-muted-foreground")} >Developers encounter many difficulties when it comes to having their code audited</p>
          <ul className="flex gap-4 flex-col pl-6 list-disc">
            <li>Limited existing solution</li>
            <li>Expensive</li>
            <li>Audit insecurity</li>
            <li>Lack of transparency</li>
          </ul>
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
          <div className="">

            <Image src={"/share.png"} alt={"Revenue sharing"} width={1920} height={1080} className="w-full"></Image>
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
        <div className="flex flex-col gap-2">
          <h2 className={cn("uppercase text-3xl font-medium", whyte.className)}>
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
        <div className="flex flex-col justify-center items-center">
          <h2 className={cn("font-medium text-3xl", whyte.className)}>Try our platform now!</h2>
          <p className="text-center text-muted-foreground">
            Publish your offer in less than 5 minutes through our platform or become an auditor to get rewarded for your knowledge
          </p>
          <div className="flex sm:gap-x-6 gap-x-2 gap-y-2 mt-8 flex-wrap">
            <Link href="publish">
              <Button className="bg-orange">Ask feedback</Button>
            </Link>
            <Link href="profile">
              <Button variant="secondary">Become an auditor</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
