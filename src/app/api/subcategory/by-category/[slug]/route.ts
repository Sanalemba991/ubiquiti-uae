import { NextRequest, NextResponse } from 'next/server';
import SubCategoryModel from '@/models/SubCategory';
import CategoryModel from '@/models/Category';

// GET - Fetch subcategories by category slug (Public)
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

    const subcategories = await SubCategoryModel.findByCategorySlug(slug, { isActive: true });

    return NextResponse.json({
      success: true,
      data: subcategories,
      count: subcategories.length,
      category: { id: category.id, name: category.name, slug: category.slug, navbar_category: category.navbar_category }
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json({ error: 'Failed to fetch subcategories' }, { status: 500 });
  }
}
