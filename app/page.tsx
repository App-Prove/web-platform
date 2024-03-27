import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col  min-h-full relative overflow-hidden justify-center">
        <h1 className="text-5xl">
          Have you ever wonder<br />
           if software was<br />
           <strong>safe?</strong>
        </h1>
        <p className="mt-6 text-lg">
          CodeShield is the <strong>best</strong> place to find <br/>
          <strong>reliable</strong> auditors to certify your code.
        </p>
        <div className="flex sm:gap-x-6 gap-x-2 gap-y-2 mt-2 flex-wrap">
          <Link href="publish">
            <Button>Ask for feedback</Button>
          </Link>
          <Link href="profile">
            <Button variant="outline">Enroll as certified auditor</Button>
          </Link>
      </div>
    </div>
  );
}
