'use server'
import { redirect } from 'next/navigation'

export async function goToPayment(){
    // This function is supposed to redirect the user to the payment page
    // but it's not implemented yet
    console.log('Redirecting to payment page')
    redirect('/publish/payment')

}