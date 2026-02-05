import { NextRequest, NextResponse } from 'next/server';
import NavbarCategoryModel from '@/models/NavbarCategory';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Fetch all navbar categories (Admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const navbarCategories = await NavbarCategoryModel.findAll({ orderBy: 'order' });

    return NextResponse.json({
      success: true,
      data: navbarCategories,
      count: navbarCategories.length,
    });
  } catch (error) {
    console.error('Error fetching navbar categories:', error);
    return NextResponse.json({ error: 'Failed to fetch navbar categories' }, { status: 500 });
  }
}

// POST - Create a new navbar category (Admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, order, is_active } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const trimmedName = name.trim();

    // Check for duplicate
    const existing = await NavbarCategoryModel.findByName(trimmedName);
    if (existing) {
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 409 });
    }

    const navbarCategory = await NavbarCategoryModel.create({
      name: trimmedName,
      description: description?.trim() || '',
      order: order || 0,
      is_active: is_active !== undefined ? is_active : true,
    });

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      data: navbarCategory,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating navbar category:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Duplicate category name or slug' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create navbar category' }, { status: 500 });
  }
}
