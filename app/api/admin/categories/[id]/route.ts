import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
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
      slug,
      description,
      caption,
      required,
      hidden,
      displayAs,
      maxChoices,
      order,
      pageTitle,
      url,
      onetOccupation,
      metaDescription,
      metaKeywords,
    } = body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description: description || null }),
        ...(caption !== undefined && { caption }),
        ...(required !== undefined && { required: Boolean(required) }),
        ...(hidden !== undefined && { hidden: Boolean(hidden) }),
        ...(displayAs !== undefined && { displayAs }),
        ...(maxChoices !== undefined && { maxChoices: parseInt(String(maxChoices), 10) }),
        ...(order !== undefined && { order: parseInt(String(order), 10) }),
        ...(pageTitle !== undefined && { pageTitle: pageTitle || null }),
        ...(url !== undefined && { url: url || null }),
        ...(onetOccupation !== undefined && { onetOccupation: onetOccupation || null }),
        ...(metaDescription !== undefined && { metaDescription: metaDescription || null }),
        ...(metaKeywords !== undefined && { metaKeywords: metaKeywords || null }),
      },
    });
    return NextResponse.json({ category });
  } catch (error: any) {
    console.error('Error updating category:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Category name or slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
