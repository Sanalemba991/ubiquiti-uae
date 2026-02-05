import { NextRequest, NextResponse } from 'next/server';
import CategoryModel from '@/models/Category';
import NavbarCategoryModel from '@/models/NavbarCategory';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Fetch single category (Admin only)
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
    const category = await CategoryModel.findById(id);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

// PUT - Update category (Admin only)
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
    const { name, navbar_category_id, description, image, order, is_active } = body;

    const existing = await CategoryModel.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Verify navbar category if being changed
    if (navbar_category_id && navbar_category_id !== existing.navbar_category_id) {
      const navbarCat = await NavbarCategoryModel.findById(navbar_category_id);
      if (!navbarCat) {
        return NextResponse.json({ error: 'Navbar category not found' }, { status: 404 });
      }
    }

    // Check for duplicate name if name is being changed
    const targetNavbarId = navbar_category_id || existing.navbar_category_id;
    if (name && name.trim().toLowerCase() !== existing.name.toLowerCase()) {
      const duplicate = await CategoryModel.findByNameAndNavbar(name.trim(), targetNavbarId);
      if (duplicate && duplicate.id !== id) {
        return NextResponse.json({ error: 'Category with this name already exists' }, { status: 409 });
      }
    }

    const updated = await CategoryModel.update(id, {
      name: name?.trim(),
      navbar_category_id,
      description: description?.trim(),
      image: image?.trim(),
      order,
      is_active,
    });

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Duplicate category name or slug' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE - Delete category (Admin only)
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
    const existing = await CategoryModel.findById(id);

    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    await CategoryModel.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
