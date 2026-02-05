import { NextRequest, NextResponse } from 'next/server';
import SubCategoryModel from '@/models/SubCategory';
import CategoryModel from '@/models/Category';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Fetch all subcategories (Admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');

    const subcategories = await SubCategoryModel.findAll({
      categoryId: categoryId || undefined
    });

    return NextResponse.json({
      success: true,
      data: subcategories,
      count: subcategories.length,
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json({ error: 'Failed to fetch subcategories' }, { status: 500 });
  }
}

// POST - Create a new subcategory (Admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, category_id, description, image, is_active } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Subcategory name is required' }, { status: 400 });
    }

    if (!category_id) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    const trimmedName = name.trim();

    // Check if category exists
    const category = await CategoryModel.findById(category_id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check for duplicate
    const existing = await SubCategoryModel.findByNameAndCategory(trimmedName, category_id);
    if (existing) {
      return NextResponse.json({ error: 'Subcategory with this name already exists in this category' }, { status: 409 });
    }

    const subcategory = await SubCategoryModel.create({
      name: trimmedName,
      category_id,
      description: description?.trim() || null,
      image: image?.trim() || null,
      is_active: is_active !== undefined ? is_active : true,
    });

    return NextResponse.json({
      success: true,
      message: 'Subcategory created successfully',
      data: subcategory,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating subcategory:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Duplicate subcategory name or slug' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create subcategory' }, { status: 500 });
  }
}
