import { NextRequest, NextResponse } from 'next/server';
import ProductEnquiryModel from '@/models/ProductEnquiry';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Fetch all product enquiries (Admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const enquiries = await ProductEnquiryModel.findAll();

    return NextResponse.json({
      success: true,
      data: enquiries,
      count: enquiries.length,
    });
  } catch (error) {
    console.error('Error fetching product enquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch product enquiries' }, { status: 500 });
  }
}
