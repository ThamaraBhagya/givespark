// app/api/upload/image/route.ts

import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Define the file size limit (e.g., 5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; 

export async function POST(req: Request) {
  // 1. Check for authenticated user (Optional, but recommended for security)
  // You can add logic here to restrict uploads to logged-in users.

  try {
    // Ensure the request body is available for form data parsing
    if (!req.body) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // 2. Parse the file from the form data
    const formData = await req.formData();
    const file = formData.get('file') as File; // The key name must match the frontend

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit.' }, { status: 400 });
    }

    // 3. Upload the file to Vercel Blob Storage
    // The 'put' function automatically handles file stream/buffer and returns metadata
    const blob = await put(
      file.name, // The filename
      file,      // The file object/stream
      {
        access: 'public', // Makes the file accessible via URL
        contentType: file.type,
      }
    );

    // 4. Return the public URL for storage in the Prisma model
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