import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

// GET - Fetch all active categories (Public)
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Fetch only active categories with populated navbar category
    const categories = await Category.find({ isActive: true })
      .populate('navbarCategory', 'name slug isActive')
      .sort({ order: 1, createdAt: -1 })
      .select('name slug description image order navbarCategory');

    // Filter out categories whose navbar category is inactive
    const activeCategories = categories.filter(
      (cat: any) => cat.navbarCategory?.isActive
    );

    return NextResponse.json({
      success: true,
      data: activeCategories,
      count: activeCategories.length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
