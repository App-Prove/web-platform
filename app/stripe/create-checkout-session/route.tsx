// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { getWebsiteURL } from '@/lib/utils';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.refreshSession();
  const { user } = data;
  if (error || !user) {
    // return NextResponse.redirect('/login');
  }
  // Get id from post data
  const { id } = await request.json();
  // Get offer data from id
  const { data: offerData, error: offerError } = await supabase.from('offers').select('*').eq('id',id);
  // Get budget from id of the offer
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    customer_email: user?.email,
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: 'usd',
          product: process.env.STRIPE_PRODUCT_ID,
          unit_amount_decimal: (Number(offerData?.[0]?.budget) ?? 0) * 100, //because in decimal
        },
        quantity: 1,
      },
    ],
    metadata: {
      id: id
    },
    mode: 'payment',
    return_url: `${getWebsiteURL()}/publish/payment/processed?session_id={CHECKOUT_SESSION_ID}`,
  });
  return NextResponse.json({
    clientSecret: session.client_secret
  });
}