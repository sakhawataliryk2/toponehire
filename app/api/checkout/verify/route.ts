import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
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
    let stripeConfig: { secretKey?: string } = {};
    try {
      stripeConfig = JSON.parse(stripePaymentMethod.config);
    } catch {
      return NextResponse.json(
        { error: 'Invalid Stripe configuration' },
        { status: 500 }
      );
    }

    if (!stripeConfig.secretKey) {
      return NextResponse.json(
        { error: 'Stripe secret key is not configured' },
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

    // Retrieve checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid' && session.metadata?.orderId) {
      // Update order status to PAID
      const order = await prisma.order.update({
        where: { id: session.metadata.orderId },
        data: { status: 'PAID' },
        include: {
          product: true,
          paymentMethod: true,
        },
      });

      return NextResponse.json({ order, session });
    }

    return NextResponse.json({ session });
  } catch (error: any) {
    console.error('Error verifying checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to verify checkout session', details: error?.message },
      { status: 500 }
    );
  }
}
