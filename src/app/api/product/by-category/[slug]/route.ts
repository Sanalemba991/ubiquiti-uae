import { NextRequest, NextResponse } from 'next/server';
import ProductModel from '@/models/Product';
import CategoryModel from '@/models/Category';

// GET - Fetch products by category slug (Public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const category = await CategoryModel.findBySlug(slug);
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (!category.is_active) {
      return NextResponse.json({ error: 'Category is not active' }, { status: 404 });
    }

    const { products } = await ProductModel.findByCategorySlug(slug, { isActive: true });

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
      category: { id: category.id, name: category.name, slug: category.slug, navbar_category: category.navbar_category }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
