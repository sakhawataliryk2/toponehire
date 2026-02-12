import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const context = searchParams.get('context'); // EMPLOYER, JOB_SEEKER, RESUME, APPLICATION

    const where: { context?: string } = {};
    if (context && ['EMPLOYER', 'JOB_SEEKER', 'RESUME', 'APPLICATION', 'JOB'].includes(context)) {
      where.context = context;
    }

    const fields = await prisma.customField.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ fields });
  } catch (error: any) {
    console.error('Error fetching custom fields:', error);
    const errorMessage = error?.message || 'Unknown error';
    const errorDetails = process.env.NODE_ENV === 'development' ? errorMessage : undefined;
    return NextResponse.json(
      { 
        error: 'Failed to fetch custom fields',
        details: errorDetails
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { caption, type, context, required, hidden, order, options, placeholder, helpText, validation } = body;

    if (!caption || !type || !context) {
      return NextResponse.json(
        { error: 'Missing required fields: caption, type, context' },
        { status: 400 }
      );
    }

    if (!['EMPLOYER', 'JOB_SEEKER', 'RESUME', 'APPLICATION', 'JOB'].includes(context)) {
      return NextResponse.json({ error: 'Invalid context' }, { status: 400 });
    }

    // Validate field type
    const validTypes = [
      'TEXT_FIELD', 'TEXT_AREA', 'EMAIL', 'PASSWORD', 'NUMBER', 'DATE',
      'DROPDOWN', 'MULTISELECT', 'CHECKBOX', 'RADIO', 'FILE', 'PICTURE',
      'LOCATION', 'COMPLEX', 'SOCIAL_NETWORK', 'GALLERY', 'ACCOUNT_TYPE'
    ];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: `Invalid field type: ${type}` }, { status: 400 });
    }

    const field = await prisma.customField.create({
      data: {
        caption: caption.trim(),
        type: type,
        context: context,
        required: Boolean(required),
        hidden: Boolean(hidden),
        order: order != null ? parseInt(String(order), 10) : 0,
        options: options ? String(options).trim() : null,
        placeholder: placeholder ? String(placeholder).trim() : null,
        helpText: helpText ? String(helpText).trim() : null,
        validation: validation ? String(validation).trim() : null,
      },
    });

    return NextResponse.json({ field }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating custom field:', error);
    const errorMessage = error?.message || 'Unknown error';
    const errorDetails = process.env.NODE_ENV === 'development' ? errorMessage : undefined;
    return NextResponse.json(
      { 
        error: 'Failed to create custom field',
        details: errorDetails
      },
      { status: 500 }
    );
  }
}
