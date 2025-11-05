import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactEnquiry from '@/models/ContactEnquiry';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Get single enquiry (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const enquiry = await ContactEnquiry.findById(id);

    if (!enquiry) {
      return NextResponse.json(
        { success: false, error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: enquiry });
  } catch (error: any) {
    console.error('Error fetching contact enquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enquiry' },
      { status: 500 }
    );
  }
}

// PUT - Update enquiry status (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { status } = body;

    const { id } = await params;
    const enquiry = await ContactEnquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return NextResponse.json(
        { success: false, error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: enquiry, message: 'Status updated successfully' });
  } catch (error: any) {
    console.error('Error updating contact enquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update enquiry' },
      { status: 500 }
    );
  }
}

// DELETE - Delete enquiry (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const enquiry = await ContactEnquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return NextResponse.json(
        { success: false, error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting contact enquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete enquiry' },
      { status: 500 }
    );
  }
}
