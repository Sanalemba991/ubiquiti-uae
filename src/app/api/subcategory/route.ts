import { NextRequest, NextResponse } from 'next/server';
import SubCategoryModel from '@/models/SubCategory';

// GET - Fetch all active subcategories (Public)
export async function GET(request: NextRequest) {
  try {
    const subcategories = await SubCategoryModel.findAll({
      isActive: true
    });

    return NextResponse.json({
      success: true,
      data: subcategories,
      count: subcategories.length,
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subcategories' },
      { status: 500 }
    );
  }
}
