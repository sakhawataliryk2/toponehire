import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Public RSS/XML feed endpoint (no auth required) - Legacy endpoint, redirects to new feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'rss';
    const limit = searchParams.get('limit') || '100';
    
    // Redirect to new feed endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    (request.headers.get('host') ? `https://${request.headers.get('host')}` : 'https://toponehire.com');
    
    const newUrl = `${baseUrl}/jobs-feed.xml?format=${format}&limit=${limit}`;
    
    return NextResponse.redirect(newUrl, 301); // Permanent redirect
  } catch (error) {
    console.error('RSS feed redirect error:', error);
    return NextResponse.json({ error: 'Failed to redirect feed' }, { status: 500 });
  }
}
