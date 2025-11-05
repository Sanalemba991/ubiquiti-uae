import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SubCategory from '@/models/SubCategory';

// GET - Fetch all active subcategories (Public)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');

    const query: any = { isActive: true };
    if (categoryId) {
      query.category = categoryId;
    }

    const subCategories = await SubCategory.find(query)
      .populate({
        path: 'category',
        select: 'name slug navbarCategory',
        populate: {
          path: 'navbarCategory',
          select: 'name slug'
        }
      })
      .sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: subCategories,
      count: subCategories.length
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subcategories' },
      { status: 500 }
    );
  }
}
