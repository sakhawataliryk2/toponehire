import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // EMPLOYER | JOB_SEEKER

    const where: { type?: 'EMPLOYER' | 'JOB_SEEKER' } = {};
    if (type === 'EMPLOYER' || type === 'JOB_SEEKER') {
      where.type = type;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const serialized = products.map((p) => ({
      ...p,
      price: Number(p.price),
    }));

    return NextResponse.json({ products: serialized });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      name,
      description,
      price,
      billingInterval,
      firstMonthFree,
      postJobs,
      featuredEmployer,
      resumeAccess,
      postResumes,
      jobAccess,
      assignedOnRegistration,
      active,
    } = body;

    if (!type || !name || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: type, name, price' },
        { status: 400 }
      );
    }

    if (type !== 'EMPLOYER' && type !== 'JOB_SEEKER') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        type,
        name,
        description: description || null,
        price: Number(price),
        billingInterval: billingInterval === 'YEARLY' ? 'YEARLY' : 'MONTHLY',
        firstMonthFree: Boolean(firstMonthFree),
        postJobs: Boolean(postJobs),
        featuredEmployer: Boolean(featuredEmployer),
        resumeAccess: Boolean(resumeAccess),
        postResumes: Boolean(postResumes),
        jobAccess: Boolean(jobAccess),
        assignedOnRegistration: Boolean(assignedOnRegistration),
        active: active !== false,
      },
    });

    return NextResponse.json({ product: { ...product, price: Number(product.price) } }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
