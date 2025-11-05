import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactEnquiry from '@/models/ContactEnquiry';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Get all contact enquiries (admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const enquiries = await ContactEnquiry.find()
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: enquiries });
  } catch (error: any) {
    console.error('Error fetching contact enquiries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}
