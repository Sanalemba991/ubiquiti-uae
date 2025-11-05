import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SubCategory from '@/models/SubCategory';
import Category from '@/models/Category';
import { verifyAdminAuth } from '@/lib/auth-helpers';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    await connectDB();
    const sub = await SubCategory.findById(id).populate({
      path: 'category',
      select: 'name slug navbarCategory',
      populate: {
        path: 'navbarCategory',
        select: 'name slug'
      }
    });
    if (!sub) return NextResponse.json({ error: 'Sub-category not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: sub });
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    return NextResponse.json({ error: 'Failed to fetch subcategory' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    await connectDB();

    const body = await request.json();
    const { name, category, description, image, isActive } = body;

    const sub = await SubCategory.findById(id);
    if (!sub) return NextResponse.json({ error: 'Sub-category not found' }, { status: 404 });

    if (name && name.trim() && name.trim() !== sub.name) {
      const existing = await SubCategory.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }, category: category || sub.category, _id: { $ne: id } });
      if (existing) return NextResponse.json({ error: 'Sub-category with this name already exists in this category' }, { status: 409 });
      sub.name = name.trim();
    }

    if (category && category !== sub.category.toString()) {
      const parent = await Category.findById(category);
      if (!parent) return NextResponse.json({ error: 'Parent category not found' }, { status: 404 });
      sub.category = category;
    }

    if (description !== undefined) sub.description = description?.trim() || '';
    if (image !== undefined) sub.image = image?.trim() || '';
    if (isActive !== undefined) sub.isActive = isActive;

    await sub.save();
    await sub.populate({
      path: 'category',
      select: 'name slug navbarCategory',
      populate: {
        path: 'navbarCategory',
        select: 'name slug'
      }
    });

    return NextResponse.json({ success: true, message: 'Sub-category updated', data: sub });
  } catch (error: any) {
    console.error('Error updating subcategory:', error);
    if (error.code === 11000) return NextResponse.json({ error: 'Duplicate slug' }, { status: 409 });
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update subcategory' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    await connectDB();
    const sub = await SubCategory.findByIdAndDelete(id);
    if (!sub) return NextResponse.json({ error: 'Sub-category not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Sub-category deleted', data: sub });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return NextResponse.json({ error: 'Failed to delete subcategory' }, { status: 500 });
  }
}
