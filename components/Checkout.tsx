'use client'
import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import Link from "next/link";
import { Button } from "./ui/button";
import { useSearchParams } from "next/navigation";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test public API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY ?? '');

export const CheckoutForm = () => {
  var id = 0;
  var affiliate = '';
  var pricing = '';
  // doesn't seem to be working on mobile
  if (typeof window !== 'undefined') {
    
    id = Number(localStorage.getItem('id')) ?? 0;
    affiliate = localStorage.getItem('affiliate')?.replace(/"/g, "") ?? '';
    pricing = localStorage.getItem('pricing')?.replace(/"/g, "") ?? '';
  };
  const fetchClientSecret = useCallback(async () => {
    // Get the id from localStorage
    // Create a Checkout Session
    const res = await fetch(`/stripe/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: id, affiliate: affiliate, pricing: pricing })
    });
    const data = await res.json();
    if (data.error) return null
    return data.clientSecret;
  }, []);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      {options?
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
      :
      <>
      <p>ERROR</p>
      </>
      }
    </div>
  )
}

export const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [offerId, setOfferId] = useState(null);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    fetch(`/stripe/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        // Client side
        setOfferId(data.id);
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === 'open') {
    return (
      <Link href="/checkout" />
    )
  }

  if (status === 'complete') {
    localStorage.clear();
    return (
      <section id="success" className="flex flex-col gap-2">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}.

          If you have any questions, please email <a href="mailto:contact@app-prove.com">contact@app-prove.com</a>.
        </p>

        <Link className='self-end' href={"/offer/" + offerId}><Button>Visit offer page</Button> </Link>
      </section>
    )
  }

  return null;
}
