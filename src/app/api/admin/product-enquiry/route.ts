import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProductEnquiry from '@/models/ProductEnquiry';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Get all product enquiries (admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const enquiries = await ProductEnquiry.find()
      .sort({ createdAt: -1 });

    return NextResponse.json(enquiries);
  } catch (error: any) {
    console.error('Error fetching product enquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}
