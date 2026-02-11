import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ product: { ...product, price: Number(product.price) } });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
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

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(billingInterval !== undefined && { billingInterval: billingInterval === 'YEARLY' ? 'YEARLY' : 'MONTHLY' }),
        ...(firstMonthFree !== undefined && { firstMonthFree: Boolean(firstMonthFree) }),
        ...(postJobs !== undefined && { postJobs: Boolean(postJobs) }),
        ...(featuredEmployer !== undefined && { featuredEmployer: Boolean(featuredEmployer) }),
        ...(resumeAccess !== undefined && { resumeAccess: Boolean(resumeAccess) }),
        ...(postResumes !== undefined && { postResumes: Boolean(postResumes) }),
        ...(jobAccess !== undefined && { jobAccess: Boolean(jobAccess) }),
        ...(assignedOnRegistration !== undefined && { assignedOnRegistration: Boolean(assignedOnRegistration) }),
        ...(active !== undefined && { active: Boolean(active) }),
      },
    });
    return NextResponse.json({ product: { ...product, price: Number(product.price) } });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
