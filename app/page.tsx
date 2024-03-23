import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div className=" flex flex-col justify-center h-full relative overflow-hidden">
      <Image src="/waves.png" alt="waves background" width={1578.76} height={1021.86} className="-rotate-45 absolute -z-10 -right-72 top-48"></Image>
      <h1 className="text-5xl">
        Next <strong>auditing</strong> <br />
        platform <br />
        for your <strong>code !</strong>
      </h1>
      <p className="mt-6">
        Your go-to marketplace for open-source audits and code certification. <br />
        Bringing developers together for <strong>secure</strong>, <strong>certified</strong> solutions!
      </p>
      <div className="flex gap-6 mt-2">
        <Link href="login">
          <Button >Enroll as an auditor</Button>
        </Link>
        <Button variant="link">Need to certify your code?</Button>
      </div>
    </div>
  );
}
