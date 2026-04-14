// src/app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with the secret key.
// The "!" at the end asserts that the environment variable will be present.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// This function handles POST requests to the API route.
export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the amount and product ID.
    const { amount, productId } = await request.json();

    // Create a PaymentIntent with the specified amount and currency.
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      // automatic_payment_methods allows Stripe to dynamically show payment methods
      // like cards, Apple Pay, Google Pay, etc.
      automatic_payment_methods: {
        enabled: true,
      },
      // metadata is a good place to store extra information, like a product ID.
      metadata: {
        productId,
      },
    });

    // Return the client_secret to the frontend.
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    // Handle any errors that occur during the process.
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: `Error creating payment intent: ${error.message}` },
      { status: 500 }
    );
  }
}
