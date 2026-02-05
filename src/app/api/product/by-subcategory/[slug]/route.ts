import { NextRequest, NextResponse } from 'next/server';
import ProductModel from '@/models/Product';
import SubCategoryModel from '@/models/SubCategory';

// GET - Fetch products by subcategory slug (Public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const subcategory = await SubCategoryModel.findBySlug(slug);
    
    if (!subcategory) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
    }

    if (!subcategory.is_active) {
      return NextResponse.json({ error: 'Subcategory is not active' }, { status: 404 });
    }

    const { products } = await ProductModel.findBySubcategorySlug(slug, { isActive: true });

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
      subcategory: { id: subcategory.id, name: subcategory.name, slug: subcategory.slug, category: subcategory.category }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
