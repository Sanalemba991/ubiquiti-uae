import { NextRequest, NextResponse } from 'next/server';
import CategoryModel from '@/models/Category';
import NavbarCategoryModel from '@/models/NavbarCategory';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Fetch all categories (Admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const navbarCategoryId = searchParams.get('navbarCategory');

    const categories = await CategoryModel.findAll({
      navbarCategoryId: navbarCategoryId || undefined,
      orderBy: 'order'
    });

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST - Create a new category (Admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, navbar_category_id, description, image, order, is_active } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    if (!navbar_category_id) {
      return NextResponse.json({ error: 'Navbar category is required' }, { status: 400 });
    }

    const trimmedName = name.trim();

    // Check if navbar category exists
    const navbarCat = await NavbarCategoryModel.findById(navbar_category_id);
    if (!navbarCat) {
      return NextResponse.json({ error: 'Navbar category not found' }, { status: 404 });
    }

    // Check for duplicate
    const existing = await CategoryModel.findByNameAndNavbar(trimmedName, navbar_category_id);
    if (existing) {
      return NextResponse.json({ error: 'Category with this name already exists in this navbar category' }, { status: 409 });
    }

    const category = await CategoryModel.create({
      name: trimmedName,
      navbar_category_id,
      description: description?.trim() || null,
      image: image?.trim() || null,
      order: order || 0,
      is_active: is_active !== undefined ? is_active : true,
    });

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      data: category,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Duplicate category name or slug' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
