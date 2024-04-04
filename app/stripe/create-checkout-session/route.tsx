// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const budget = searchParams.get('budget')
  const supabase = createClient();
  const { data, error } = await supabase.auth.refreshSession();
  const {user} = data;
  // Get budget and id of the offer
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    customer_email:user?.email,
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: 'usd',
          product: process.env.STRIPE_PRODUCT_ID,
          unit_amount_decimal: (Number(budget) ?? 0) * 100, //because in decimal
        },
        quantity: 1,
      },
    ],
    metadata:{
      id: searchParams.get('id')
    },
    mode: 'payment',
    return_url: `${process.env.YOUR_DOMAIN}/publish/payment/processed?session_id={CHECKOUT_SESSION_ID}`,
  });
  return NextResponse.json({
    clientSecret: session.client_secret
  });
}