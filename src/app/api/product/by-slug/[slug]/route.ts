import { NextRequest, NextResponse } from 'next/server';
import ProductModel from '@/models/Product';

// GET - Fetch product by slug (Public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await ProductModel.findBySlug(slug);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (!product.is_active) {
      return NextResponse.json({ error: 'Product is not active' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
