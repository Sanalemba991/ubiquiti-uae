import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import SubCategory from '@/models/SubCategory';

// GET - Fetch products by subcategory slug (Public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    await connectDB();

    // Find the subcategory by slug
    const subcategory = await SubCategory.findOne({ slug, isActive: true })
      .populate({
        path: 'category',
        select: 'name slug navbarCategory',
        populate: {
          path: 'navbarCategory',
          select: 'name slug'
        }
      });

    if (!subcategory) {
      return NextResponse.json(
        { success: false, error: 'Subcategory not found' },
        { status: 404 }
      );
    }

    // Fetch products for this subcategory
    const products = await Product.find({
      subcategory: subcategory._id,
      isActive: true
    })
      .populate('navbarCategory', 'name slug')
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: products,
      subcategory: {
        _id: subcategory._id,
        name: subcategory.name,
        slug: subcategory.slug,
        description: subcategory.description,
        image: subcategory.image,
        category: subcategory.category
      },
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products by subcategory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
