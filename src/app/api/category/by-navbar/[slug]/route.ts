import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import NavbarCategory from '@/models/NavbarCategory';

// GET - Fetch categories by navbar category slug (Public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Connect to database
    await connectDB();

    // Find navbar category by slug
    const navbarCategory = await NavbarCategory.findOne({ slug, isActive: true });

    if (!navbarCategory) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        message: 'Navbar category not found or inactive'
      });
    }

    // Fetch active categories for this navbar category
    const categories = await Category.find({
      navbarCategory: navbarCategory._id,
      isActive: true
    })
      .populate('navbarCategory', 'name slug')
      .sort({ order: 1, createdAt: -1 })
      .select('name slug description image order');

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
      navbarCategory: {
        _id: navbarCategory._id,
        name: navbarCategory.name,
        slug: navbarCategory.slug,
        description: navbarCategory.description
      }
    });
  } catch (error) {
    console.error('Error fetching categories by navbar:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
