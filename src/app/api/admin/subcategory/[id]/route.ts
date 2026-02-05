import { NextRequest, NextResponse } from 'next/server';
import SubCategoryModel from '@/models/SubCategory';
import CategoryModel from '@/models/Category';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Fetch single subcategory (Admin only)
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
    const subcategory = await SubCategoryModel.findById(id);

    if (!subcategory) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: subcategory });
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    return NextResponse.json({ error: 'Failed to fetch subcategory' }, { status: 500 });
  }
}

// PUT - Update subcategory (Admin only)
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
    const { name, category_id, description, image, is_active } = body;

    const existing = await SubCategoryModel.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
    }

    // Verify category if being changed
    if (category_id && category_id !== existing.category_id) {
      const category = await CategoryModel.findById(category_id);
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
    }

    // Check for duplicate name if name is being changed
    const targetCategoryId = category_id || existing.category_id;
    if (name && name.trim().toLowerCase() !== existing.name.toLowerCase()) {
      const duplicate = await SubCategoryModel.findByNameAndCategory(name.trim(), targetCategoryId);
      if (duplicate && duplicate.id !== id) {
        return NextResponse.json({ error: 'Subcategory with this name already exists' }, { status: 409 });
      }
    }

    const updated = await SubCategoryModel.update(id, {
      name: name?.trim(),
      category_id,
      description: description?.trim(),
      image: image?.trim(),
      is_active,
    });

    return NextResponse.json({
      success: true,
      message: 'Subcategory updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating subcategory:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Duplicate subcategory name or slug' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update subcategory' }, { status: 500 });
  }
}

// DELETE - Delete subcategory (Admin only)
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
    const existing = await SubCategoryModel.findById(id);

    if (!existing) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
    }

    await SubCategoryModel.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Subcategory deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return NextResponse.json({ error: 'Failed to delete subcategory' }, { status: 500 });
  }
}
