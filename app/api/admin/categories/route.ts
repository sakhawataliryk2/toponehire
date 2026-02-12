import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description: description || null,
        caption: caption || 'Categories',
        required: required !== false,
        hidden: Boolean(hidden),
        displayAs: displayAs || 'MultiList',
        maxChoices: maxChoices != null ? parseInt(String(maxChoices), 10) : 0,
        order: order != null ? parseInt(String(order), 10) : 0,
        pageTitle: pageTitle || null,
        url: url || null,
        onetOccupation: onetOccupation || null,
        metaDescription: metaDescription || null,
        metaKeywords: metaKeywords || null,
      },
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Category name or slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
