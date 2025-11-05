import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

// GET - Fetch products by category slug (Public)
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

    // Fetch products for this category
    const products = await Product.find({
      category: category._id,
      isActive: true
    })
      .populate('navbarCategory', 'name slug')
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: products,
      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        navbarCategory: category.navbarCategory
      },
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
