import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getStorageUrl, generateFilePath } from '@/lib/supabase';
import { verifyAdminAuth } from '@/lib/auth-helpers';

const BUCKET_NAME = 'ubiquiti';

// POST - Upload image to Supabase Storage
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 5MB' },
        { status: 400 }
      );
    }

    // Generate unique file path
    const filePath = generateFilePath(folder, file.name);

    // Convert file to buffer
    const buffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Get public URL
    const publicUrl = getStorageUrl(BUCKET_NAME, data.path);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: data.path,
      fullPath: data.fullPath,
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// DELETE - Remove image from Supabase Storage
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json(
        { error: 'No file path provided' },
        { status: 400 }
      );
    }

    // Delete from Supabase Storage
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error('Supabase Storage delete error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete image' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete image' },
      { status: 500 }
    );
  }
}
