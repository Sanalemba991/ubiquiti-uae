import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SubCategory from '@/models/SubCategory';
import Category from '@/models/Category';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Fetch all subcategories (Admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');

    const query: any = {};
    if (categoryId) query.category = categoryId;

    const subs = await SubCategory.find(query)
      .populate({
        path: 'category',
        select: 'name slug navbarCategory',
        populate: {
          path: 'navbarCategory',
          select: 'name slug'
        }
      })
      .sort({ createdAt: -1, order: 1 });

    return NextResponse.json({ success: true, data: subs, count: subs.length });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json({ error: 'Failed to fetch subcategories' }, { status: 500 });
  }
}

// POST - Create subcategory (Admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { name, category, description, image, isActive } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Sub-category name is required' }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ error: 'Parent category is required' }, { status: 400 });
    }

    const parent = await Category.findById(category);
    if (!parent) return NextResponse.json({ error: 'Parent category not found' }, { status: 404 });

    const trimmedName = name.trim();

    const existing = await SubCategory.findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }, category });
    if (existing) return NextResponse.json({ error: 'Sub-category with this name already exists in this category' }, { status: 409 });

    const sub = new SubCategory({ name: trimmedName, category, description: description?.trim() || '', image: image?.trim() || '', isActive: isActive !== undefined ? isActive : true });
    await sub.save();
    await sub.populate({
      path: 'category',
      select: 'name slug navbarCategory',
      populate: {
        path: 'navbarCategory',
        select: 'name slug'
      }
    });

    return NextResponse.json({ success: true, message: 'Sub-category created', data: sub }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating subcategory:', error);
    if (error.code === 11000) return NextResponse.json({ error: 'Duplicate subcategory slug' }, { status: 409 });
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create subcategory' }, { status: 500 });
  }
}
