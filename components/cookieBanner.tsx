"use client";
import Link from "next/link";
import { useLocalStorage } from "@/lib/localStorage"
import { useEffect, useState } from "react";
export default function CookieBanner() {
  const [cookieConsent, setCookieConsent] = useLocalStorage("cookies_consent",false);

  // useEffect(() => {
  //   const newValue = cookieConsent ? "granted" : "denied";
  //   window.gtag("consent", "update", {
  //     analytics_storage: newValue,
  //   });
  //   setLocalStorage("cookie_consent", cookieConsent);
  //   console.log("Cookie Consent: ", cookieConsent);
  // }, [cookieConsent]);

  return (
    <div
      className={`${
        cookieConsent === true
          ? "hidden"
          : "flex  flex-col fixed inset-x-0 bottom-0 z-20  justify-between gap-x-8 gap-y-4 bg-white p-6 ring-1 ring-gray-900/10 md:flex-row md:items-center lg:px-8 xs:block"
      }`}
    >
      <p className="max-w-4xl text-sm leading-6 text-gray-900">
        This website uses cookies to enhance your browsing experience, analyze
        site traffic, and serve better user experiences. By continuing to use
        this site, you consent to our use of cookies. Learn more in our{" "}
        <Link className="font-semibold text-[#8A2BE2]" href="/cookies">
          cookie policy
        </Link>
      </p>


      <div className="flex gap-2">
        <div className="mr-16 flex flex-none items-center gap-x-5">
          <button
            onClick={() => setCookieConsent(true)}
            type="button"
            className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            Accept all 🍪
          </button>
          <button
            onClick={() => setCookieConsent(false)}
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Reject all
          </button>
        </div>
      </div>
    </div>
  );
}