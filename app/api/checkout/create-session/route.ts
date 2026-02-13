import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, employerId } = body;

    if (!productId || !employerId) {
      return NextResponse.json(
        { error: 'Product ID and Employer ID are required' },
        { status: 400 }
      );
    }

    // Fetch product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (!product.active) {
      return NextResponse.json({ error: 'Product is not active' }, { status: 400 });
    }

    // Fetch employer
    const employer = await prisma.employer.findUnique({
      where: { id: employerId },
    });

    if (!employer) {
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 });
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
    let stripeConfig: { secretKey?: string; publishableKey?: string } = {};
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

    // Initialize Stripe (dynamic import to avoid issues if not installed)
    let Stripe;
    try {
      Stripe = (await import('stripe')).default;
    } catch {
      return NextResponse.json(
        { error: 'Stripe SDK is not installed. Please run: npm install stripe' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: '2024-12-18.acacia',
    });

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Create order in database (UNPAID status)
    const order = await prisma.order.create({
      data: {
        invoiceNumber,
        customerType: 'EMPLOYER',
        employerId: employer.id,
        productId: product.id,
        total: product.price,
        paymentMethodId: stripePaymentMethod.id,
        status: 'UNPAID',
      },
    });

    // Create Stripe checkout session
    const isSubscription = product.billingInterval === 'MONTHLY' || product.billingInterval === 'YEARLY';
    const lineItems: any[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description || undefined,
          },
          unit_amount: Math.round(Number(product.price) * 100), // Convert to cents
          ...(isSubscription && {
            recurring: {
              interval: product.billingInterval === 'MONTHLY' ? 'month' : 'year',
            },
          }),
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: isSubscription ? 'subscription' : 'payment',
      customer_email: employer.email,
      metadata: {
        orderId: order.id,
        employerId: employer.id,
        productId: product.id,
        invoiceNumber: invoiceNumber,
      },
      success_url: `${request.headers.get('origin') || 'http://localhost:3000'}/my-account/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin') || 'http://localhost:3000'}/my-account/checkout/cancel`,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      orderId: order.id,
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error?.message },
      { status: 500 }
    );
  }
}
