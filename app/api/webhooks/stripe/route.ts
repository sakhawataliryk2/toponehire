import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Get Stripe payment method
    const stripePaymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        name: { equals: 'Stripe', mode: 'insensitive' },
        isActive: true,
      },
    });

    if (!stripePaymentMethod || !stripePaymentMethod.config) {
      return NextResponse.json(
        { error: 'Stripe payment method is not configured' },
        { status: 400 }
      );
    }

    // Parse Stripe config
    let stripeConfig: { secretKey?: string; webhookSecret?: string } = {};
    try {
      stripeConfig = JSON.parse(stripePaymentMethod.config);
    } catch {
      return NextResponse.json(
        { error: 'Invalid Stripe configuration' },
        { status: 500 }
      );
    }

    if (!stripeConfig.secretKey || !stripeConfig.webhookSecret) {
      return NextResponse.json(
        { error: 'Stripe configuration incomplete' },
        { status: 500 }
      );
    }

    // Initialize Stripe
    let Stripe;
    try {
      Stripe = (await import('stripe')).default;
    } catch {
      return NextResponse.json(
        { error: 'Stripe SDK is not installed' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: '2024-12-18.acacia',
    });

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, stripeConfig.webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;

      if (session.payment_status === 'paid' && session.metadata?.orderId) {
        // Update order status to PAID
        await prisma.order.update({
          where: { id: session.metadata.orderId },
          data: { status: 'PAID' },
        });

        // Here you can add logic to activate the plan for the employer
        // For example, update employer's subscription status, grant access to features, etc.
        if (session.metadata?.employerId && session.metadata?.productId) {
          // You might want to create a subscription record or update employer's active product
          console.log(`Plan activated for employer ${session.metadata.employerId}, product ${session.metadata.productId}`);
        }
      }
    } else if (event.type === 'invoice.payment_succeeded') {
      // Handle recurring subscription payments
      const invoice = event.data.object as any;
      if (invoice.metadata?.orderId) {
        await prisma.order.update({
          where: { id: invoice.metadata.orderId },
          data: { status: 'PAID' },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error?.message },
      { status: 500 }
    );
  }
}
