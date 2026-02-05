import { NextRequest, NextResponse } from 'next/server';
import ProductModel from '@/models/Product';

// GET - Fetch all active products (Public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const navbarCategoryId = searchParams.get('navbarCategory');
    const categoryId = searchParams.get('category');
    const subcategoryId = searchParams.get('subcategory');

    const products = await ProductModel.findAll({
      isActive: true,
      navbarCategoryId: navbarCategoryId || undefined,
      categoryId: categoryId || undefined,
      subcategoryId: subcategoryId || undefined
    });

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
