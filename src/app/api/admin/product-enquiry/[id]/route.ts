import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProductEnquiry from '@/models/ProductEnquiry';
import { verifyAdminAuth } from '@/lib/auth-helpers';

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
    const enquiry = await ProductEnquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(enquiry);
  } catch (error: any) {
    console.error('Error updating product enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update enquiry' },
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
    const enquiry = await ProductEnquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Enquiry deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to delete enquiry' },
      { status: 500 }
    );
  }
}
