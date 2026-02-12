import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

const MASK = '••••••••••••';

function maskSecretKeys(config: string | null): string | null {
  if (!config) return null;
  try {
    const o = JSON.parse(config) as Record<string, string>;
    if (typeof o.secretKey === 'string' && o.secretKey.length > 0) o.secretKey = MASK;
    if (typeof o.webhookSecret === 'string' && o.webhookSecret.length > 0) o.webhookSecret = MASK;
    return JSON.stringify(o);
  } catch {
    return config;
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id },
    });
    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    }
    const safe = { ...paymentMethod, config: maskSecretKeys(paymentMethod.config) };
    return NextResponse.json({ paymentMethod: safe });
  } catch (error) {
    console.error('Error fetching payment method:', error);
    return NextResponse.json({ error: 'Failed to fetch payment method' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, isActive, config: rawConfig } = body;
    let configToSave: string | null = undefined as unknown as string | null;
    if (rawConfig !== undefined) {
      const str = rawConfig != null ? String(rawConfig) : null;
      if (str) {
        try {
          const incoming = JSON.parse(str) as Record<string, string>;
          const existing = await prisma.paymentMethod.findUnique({ where: { id }, select: { config: true } });
          let existingObj: Record<string, string> = {};
          if (existing?.config) {
            try {
              existingObj = JSON.parse(existing.config) as Record<string, string>;
            } catch {
              /* ignore */
            }
          }
          if (incoming.secretKey === MASK && existingObj.secretKey) incoming.secretKey = existingObj.secretKey;
          if (incoming.webhookSecret === MASK && existingObj.webhookSecret) incoming.webhookSecret = existingObj.webhookSecret;
          configToSave = JSON.stringify(incoming);
        } catch {
          configToSave = str;
        }
      } else {
        configToSave = null;
      }
    }
    const paymentMethod = await prisma.paymentMethod.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: String(name).trim() }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(configToSave !== undefined && { config: configToSave }),
      },
    });
    return NextResponse.json({ paymentMethod: { ...paymentMethod, config: maskSecretKeys(paymentMethod.config) } });
  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json({ error: 'Failed to update payment method' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.paymentMethod.delete({ where: { id } });
    return NextResponse.json({ message: 'Payment method deleted' });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return NextResponse.json({ error: 'Failed to delete payment method' }, { status: 500 });
  }
}
