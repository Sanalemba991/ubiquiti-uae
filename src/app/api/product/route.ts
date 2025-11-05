import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET - Fetch all active products (Public)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const navbarCategoryId = searchParams.get('navbarCategory');
    const categoryId = searchParams.get('category');
    const subcategoryId = searchParams.get('subcategory');

    const query: any = { isActive: true };
    if (navbarCategoryId) query.navbarCategory = navbarCategoryId;
    if (categoryId) query.category = categoryId;
    if (subcategoryId) query.subcategory = subcategoryId;

    const products = await Product.find(query)
      .populate('navbarCategory', 'name slug')
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort({ createdAt: -1 });

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
