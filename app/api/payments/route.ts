import { handleCheckoutSessionCompleted, handleSubscriptionDeleted } from '@/lib/payment-helper';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API_KEY!);

export async function POST(req: NextRequest) {
  const payload = await req.text();

  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig!, process.env.STRIPE_WEBHOOK_SECRET!);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
          expand: ['line_items'],
        });
        //connect to the db create or update user
        await handleCheckoutSessionCompleted({ session, stripe });
        break;
      }
      case 'customer.subscription.deleted': {
        // connect to db
        const subscriptionId = event.data.object.id;
        console.log(subscriptionId);

        await handleSubscriptionDeleted({ subscriptionId, stripe });
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return NextResponse.json({
      status: 'success',
    });
  } catch (err) {
    return NextResponse.json({ status: 'Failed', err });
  }
}
