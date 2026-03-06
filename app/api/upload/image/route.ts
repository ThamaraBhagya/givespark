// app/api/upload/image/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

const MAX_FILE_SIZE = 5 * 1024 * 1024; 

export async function POST(req: Request) {
  try {
    if (!req.body) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit.' }, { status: 400 });
    }

    const blob = await put(
      file.name,
      file,
      {
        access: 'public',
        contentType: file.type,
      }
    );

    return NextResponse.json({ 
        success: true, 
        url: blob.url,
        pathname: blob.pathname 
    });

  } catch (error) {
    console.error('Blob upload failed:', error);
    return NextResponse.json(
      { error: 'Image upload failed due to server error.' },
      { status: 500 }
    );
  }
}