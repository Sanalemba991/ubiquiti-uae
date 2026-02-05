import { NextRequest, NextResponse } from 'next/server';
import ProductEnquiryModel from '@/models/ProductEnquiry';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// PUT - Update product enquiry status (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['pending', 'contacted', 'resolved'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await ProductEnquiryModel.update(id, { status });

    if (!updated) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 });
  }
}

// DELETE - Delete product enquiry (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await ProductEnquiryModel.findById(id);

    if (!existing) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    await ProductEnquiryModel.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Enquiry deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return NextResponse.json({ error: 'Failed to delete enquiry' }, { status: 500 });
  }
}
