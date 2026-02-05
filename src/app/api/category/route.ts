import { NextRequest, NextResponse } from 'next/server';
import CategoryModel from '@/models/Category';

// GET - Fetch all active categories (Public)
export async function GET(request: NextRequest) {
  try {
    const categories = await CategoryModel.findAll({
      isActive: true,
      orderBy: 'order'
    });

    // Filter out categories whose navbar category is inactive
    const activeCategories = categories.filter(
      (cat: any) => cat.navbar_category?.is_active
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
