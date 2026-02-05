import { NextRequest, NextResponse } from 'next/server';
import ContactEnquiryModel from '@/models/ContactEnquiry';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Fetch all contact enquiries (Admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const enquiries = await ContactEnquiryModel.findAll();

    return NextResponse.json({
      success: true,
      data: enquiries,
      count: enquiries.length,
    });
  } catch (error) {
    console.error('Error fetching contact enquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch contact enquiries' }, { status: 500 });
  }
}
