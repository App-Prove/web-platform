// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { getWebsiteURL } from '@/lib/utils';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server'
import StripeInvalidRequestError from 'stripe';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.refreshSession();
  const { user } = data;
  if (error || !user) {
    // return NextResponse.redirect('/login');
  }
  // Get id from post data
  // Identify promo code
  const { id, affiliate, pricing } = await request.json();
  console.log("ID is  for metadata",id)
  affiliate && console.log('Affiliate found')
  console.log('Pricing is',pricing)
  // Get offer data from id
  // Get budget from id of the offer
  const stripePayload = {
    ui_mode: 'embedded',
    customer_email: user?.email,
    line_items: [
      {
        price: pricing=='one-time-audit'?process.env.STRIPE_PRICE_ID_ONETIME:process.env.STRIPE_PRICE_ID,
        quantity: 1,
      }
    ],
    metadata: {
      id: id
    },
    mode: pricing==='one-time-audit'?'payment':'subscription',
    return_url: `${getWebsiteURL()}/publish/payment/processed?session_id={CHECKOUT_SESSION_ID}`,
  }
  try {
    const session = await stripe.checkout.sessions.create({...stripePayload, ...(affiliate ? { discounts: [{ coupon: affiliate }] } : {})});
    return NextResponse.json({
      clientSecret: session.client_secret
    });
  } catch (error) {
      // Handle StripeInvalidRequestError specifically
      const session = await stripe.checkout.sessions.create(stripePayload);
      return NextResponse.json({
        clientSecret: session.client_secret
      });
      // Return or handle the error response
      return NextResponse.json({ error: "Invalid request to Stripe." });
  }
}