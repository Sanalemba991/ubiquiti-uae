import { NextRequest, NextResponse } from 'next/server';
import ProductModel from '@/models/Product';
import CategoryModel from '@/models/Category';
import SubCategoryModel from '@/models/SubCategory';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Fetch single product (Admin only)
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
    const product = await ProductModel.findById(id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT - Update product (Admin only)
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
    const { name, description, key_features, image1, image2, image3, image4, navbar_category_id, category_id, subcategory_id, is_active } = body;

    const existing = await ProductModel.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Verify category if being changed
    if (category_id && category_id !== existing.category_id) {
      const categoryDoc = await CategoryModel.findById(category_id);
      if (!categoryDoc) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
    }

    // Verify subcategory if provided
    if (subcategory_id) {
      const subcategoryDoc = await SubCategoryModel.findById(subcategory_id);
      if (!subcategoryDoc) {
        return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
      }
      const targetCategoryId = category_id || existing.category_id;
      if (subcategoryDoc.category_id !== targetCategoryId) {
        return NextResponse.json({ error: 'Subcategory does not belong to the selected category' }, { status: 400 });
      }
    }

    // Check for duplicate name
    const targetCategoryId = category_id || existing.category_id;
    const targetSubcategoryId = subcategory_id !== undefined ? subcategory_id : existing.subcategory_id;
    if (name && name.trim().toLowerCase() !== existing.name.toLowerCase()) {
      const duplicate = await ProductModel.findByNameInCategory(name.trim(), targetCategoryId, targetSubcategoryId);
      if (duplicate && duplicate.id !== id) {
        return NextResponse.json({ error: 'Product with this name already exists' }, { status: 409 });
      }
    }

    const updated = await ProductModel.update(id, {
      name: name?.trim(),
      description: description?.trim(),
      key_features,
      image1: image1?.trim(),
      image2: image2?.trim(),
      image3: image3?.trim(),
      image4: image4?.trim(),
      navbar_category_id,
      category_id,
      subcategory_id,
      is_active,
    });

    return NextResponse.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (error: any) {
    console.error('Error updating product:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Duplicate product slug' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE - Delete product (Admin only)
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
    const existing = await ProductModel.findById(id);

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await ProductModel.delete(id);

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
