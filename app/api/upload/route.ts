import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'resumes';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type for resumes
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for resumes)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${folder}/${timestamp}-${randomString}.${fileExt}`;

    // TODO: Upload to Supabase Storage
    // To enable file uploads, install @supabase/supabase-js:
    // npm install @supabase/supabase-js
    // Then configure with your Supabase credentials in .env:
    // NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    // NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    
    // For now, return a placeholder URL structure
    // In production, upload to Supabase Storage bucket 'resumes'
    const resumeUrl = `https://your-project.supabase.co/storage/v1/object/public/resumes/${fileName}`;

    return NextResponse.json({
      success: true,
      url: resumeUrl,
      fileName: fileName,
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error?.message },
      { status: 500 }
    );
  }
}
