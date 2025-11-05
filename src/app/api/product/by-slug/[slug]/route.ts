import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET - Fetch single product by slug (Public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    await connectDB();

    const product = await Product.findOne({ slug, isActive: true })
      .populate('navbarCategory', 'name slug')
      .populate({
        path: 'category',
        select: 'name slug navbarCategory',
        populate: {
          path: 'navbarCategory',
          select: 'name slug'
        }
      })
      .populate({
        path: 'subcategory',
        select: 'name slug category',
        populate: {
          path: 'category',
          select: 'name slug'
        }
      });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
