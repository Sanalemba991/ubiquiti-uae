import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SubCategory from '@/models/SubCategory';
import Category from '@/models/Category';

// GET - Fetch subcategories by category slug (Public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    await connectDB();

    // Find the category by slug
    const category = await Category.findOne({ slug, isActive: true })
      .populate('navbarCategory', 'name slug');

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Fetch subcategories for this category
    const subCategories = await SubCategory.find({
      category: category._id,
      isActive: true
    })
      .populate({
        path: 'category',
        select: 'name slug navbarCategory',
        populate: {
          path: 'navbarCategory',
          select: 'name slug'
        }
      })
      .sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: subCategories,
      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        navbarCategory: category.navbarCategory
      },
      count: subCategories.length
    });
  } catch (error) {
    console.error('Error fetching subcategories by category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subcategories' },
      { status: 500 }
    );
  }
}
