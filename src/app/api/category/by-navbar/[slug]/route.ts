import { NextRequest, NextResponse } from 'next/server';
import CategoryModel from '@/models/Category';
import NavbarCategoryModel from '@/models/NavbarCategory';

// GET - Fetch categories by navbar category slug (Public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const navbarCategory = await NavbarCategoryModel.findBySlug(slug);
    
    if (!navbarCategory) {
      return NextResponse.json({ error: 'Navbar category not found' }, { status: 404 });
    }

    if (!navbarCategory.is_active) {
      return NextResponse.json({ error: 'Navbar category is not active' }, { status: 404 });
    }

    const categories = await CategoryModel.findByNavbarSlug(slug, { isActive: true });

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
      navbarCategory: { id: navbarCategory.id, name: navbarCategory.name, slug: navbarCategory.slug }
    });
  } catch (error) {
    console.error('Error fetching categories by navbar:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
