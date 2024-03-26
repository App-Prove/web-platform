import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col  min-h-full relative overflow-hidden justify-center">
        <Image priority={true} src="/waves.png" alt="waves background" width={1578.76} height={1021.86} className="hidden sm:block -rotate-45 absolute -z-10 -right-72 top-48"></Image>
        <h1 className="text-5xl">
          Have you ever wonder<br />
           if software was<br />
           <strong>safe?</strong>
        </h1>
        <p className="mt-6">
          CodeShield is the place where you can find <br/>
          the best auditors to certify your code.
        </p>
        <div className="flex gap-x-6 mt-2 flex-wrap">
          <Link href="publish">
            <Button >Ask for feedback</Button>
          </Link>
          <Link href="profile">
            <Button variant="link">Enroll as a certified auditor</Button>
          </Link>
      </div>
    </div>
  );
}
