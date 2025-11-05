import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import NavbarCategory from '@/models/NavbarCategory';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Fetch all categories (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const navbarCategoryId = searchParams.get('navbarCategory');

    // Build query
    const query: any = {};
    if (navbarCategoryId) {
      query.navbarCategory = navbarCategoryId;
    }

    // Fetch categories with navbar category populated
    const categories = await Category.find(query)
      .populate('navbarCategory', 'name slug')
      .sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create a new category (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();
    const { name, navbarCategory, description, image, order, isActive } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    if (!navbarCategory) {
      return NextResponse.json(
        { error: 'Navbar category is required' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();

    // Check if navbar category exists
    const navbarCat = await NavbarCategory.findById(navbarCategory);
    if (!navbarCat) {
      return NextResponse.json(
        { error: 'Navbar category not found' },
        { status: 404 }
      );
    }

    // Check if category with same name and navbar category already exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
      navbarCategory: navbarCategory
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists in this navbar category' },
        { status: 409 }
      );
    }

    // Create new category
    const category = new Category({
      name: trimmedName,
      navbarCategory,
      description: description?.trim() || '',
      image: image?.trim() || '',
      order: typeof order === 'number' ? order : 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    await category.save();

    // Populate navbar category before returning
    await category.populate('navbarCategory', 'name slug');

    return NextResponse.json(
      {
        success: true,
        message: 'Category created successfully',
        data: category,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating category:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      let errorMessage = 'Category with this slug already exists';
      
      if (error.keyValue?.slug) {
        errorMessage = `A category with the slug "${error.keyValue.slug}" already exists. Try a different name.`;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
