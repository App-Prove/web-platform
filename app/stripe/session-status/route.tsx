// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const session_id = searchParams.get('session_id')
  const session = await stripe.checkout.sessions.retrieve(session_id);
  console.log(session)
  return NextResponse.json({
    id: session.metadata.id??'',
    status: session.status,
    customer_email: session.customer_details.email
  });
}