import { NextRequest, NextResponse } from 'next/server';
import NavbarCategoryModel from '@/models/NavbarCategory';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Fetch single navbar category (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const navbarCategory = await NavbarCategoryModel.findById(id);

    if (!navbarCategory) {
      return NextResponse.json({ error: 'Navbar category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: navbarCategory });
  } catch (error) {
    console.error('Error fetching navbar category:', error);
    return NextResponse.json({ error: 'Failed to fetch navbar category' }, { status: 500 });
  }
}

// PUT - Update navbar category (Admin only)
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
    const { name, description, order, is_active } = body;

    const existing = await NavbarCategoryModel.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Navbar category not found' }, { status: 404 });
    }

    // Check for duplicate name if name is being changed
    if (name && name.trim().toLowerCase() !== existing.name.toLowerCase()) {
      const duplicate = await NavbarCategoryModel.findByName(name.trim());
      if (duplicate && duplicate.id !== id) {
        return NextResponse.json({ error: 'Category with this name already exists' }, { status: 409 });
      }
    }

    const updated = await NavbarCategoryModel.update(id, {
      name: name?.trim(),
      description: description?.trim(),
      order,
      is_active,
    });

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating navbar category:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Duplicate category name or slug' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update navbar category' }, { status: 500 });
  }
}

// DELETE - Delete navbar category (Admin only)
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
    const existing = await NavbarCategoryModel.findById(id);

    if (!existing) {
      return NextResponse.json({ error: 'Navbar category not found' }, { status: 404 });
    }

    await NavbarCategoryModel.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting navbar category:', error);
    return NextResponse.json({ error: 'Failed to delete navbar category' }, { status: 500 });
  }
}
