import { NextRequest, NextResponse } from 'next/server';
import ProductModel from '@/models/Product';
import CategoryModel from '@/models/Category';
import SubCategoryModel from '@/models/SubCategory';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Fetch all products (Admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const navbarCategoryId = searchParams.get('navbarCategory');
    const categoryId = searchParams.get('category');
    const subcategoryId = searchParams.get('subcategory');

    const products = await ProductModel.findAll({
      navbarCategoryId: navbarCategoryId || undefined,
      categoryId: categoryId || undefined,
      subcategoryId: subcategoryId || undefined,
    });

    return NextResponse.json({ success: true, data: products, count: products.length });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST - Create product (Admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, key_features, image1, image2, image3, image4, navbar_category_id, category_id, subcategory_id, is_active } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }
    if (!description || !description.trim()) {
      return NextResponse.json({ error: 'Product description is required' }, { status: 400 });
    }
    if (!image1 || !image1.trim()) {
      return NextResponse.json({ error: 'At least one product image is required' }, { status: 400 });
    }
    if (!navbar_category_id) {
      return NextResponse.json({ error: 'Navbar category is required' }, { status: 400 });
    }
    if (!category_id) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    // Verify category exists
    const categoryDoc = await CategoryModel.findById(category_id);
    if (!categoryDoc) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Verify subcategory if provided
    if (subcategory_id) {
      const subcategoryDoc = await SubCategoryModel.findById(subcategory_id);
      if (!subcategoryDoc) {
        return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
      }
      if (subcategoryDoc.category_id !== category_id) {
        return NextResponse.json({ error: 'Subcategory does not belong to the selected category' }, { status: 400 });
      }
    }

    const trimmedName = name.trim();

    // Check for duplicate
    const existing = await ProductModel.findByNameInCategory(trimmedName, category_id, subcategory_id);
    if (existing) {
      return NextResponse.json({ error: 'Product with this name already exists in this category' }, { status: 409 });
    }

    const product = await ProductModel.create({
      name: trimmedName,
      description: description.trim(),
      key_features: key_features || [],
      image1: image1.trim(),
      image2: image2?.trim() || null,
      image3: image3?.trim() || null,
      image4: image4?.trim() || null,
      navbar_category_id,
      category_id,
      subcategory_id: subcategory_id || null,
      is_active: is_active !== undefined ? is_active : true,
    });

    return NextResponse.json({ success: true, message: 'Product created successfully', data: product }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Duplicate product slug' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
