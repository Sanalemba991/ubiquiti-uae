import { NextRequest, NextResponse } from 'next/server';
import NavbarCategoryModel from '@/models/NavbarCategory';

// GET - Fetch all active navbar categories (Public)
export async function GET(request: NextRequest) {
  try {
    const navbarCategories = await NavbarCategoryModel.findAll({
      isActive: true,
      orderBy: 'order'
    });

    return NextResponse.json({
      success: true,
      data: navbarCategories,
      count: navbarCategories.length,
    });
  } catch (error) {
    console.error('Error fetching navbar categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navbar categories' },
      { status: 500 }
    );
  }
}
