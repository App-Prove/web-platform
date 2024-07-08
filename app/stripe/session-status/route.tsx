// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const session_id = searchParams.get('session_id')
  const session = await stripe.checkout.sessions.retrieve(session_id);
  console.log(session)
  if (session.status === 'complete') {
    console.log('Payment complete')
    console.log(session.metadata.id)
    // update the payment status in the database
    const supabase = createClient();
    const { data: test, error: testError } = await supabase.from('offers').select().eq('id', Number(session.metadata.id));
    console.log(test, testError)
    const { data, error } = await supabase
      .from('offers')
      .update({
        payment_status: 'complete'
      })
      .eq('id', Number(session.metadata.id))
      .select();
    //TODO handle error
    console.log(data, error)
  }
  return NextResponse.json({
    id: session.metadata.id ?? '',
    status: session.status,
    customer_email: session.customer_details.email
  });
}