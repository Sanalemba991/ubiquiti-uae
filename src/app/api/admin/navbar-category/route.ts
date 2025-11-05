import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import NavbarCategory from '@/models/NavbarCategory';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Fetch all navbar categories (Admin only)
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

    // Fetch all categories sorted by order
    const categories = await NavbarCategory.find({}).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error('Error fetching navbar categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navbar categories' },
      { status: 500 }
    );
  }
}

// POST - Create a new navbar category (Admin only)
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
    const { name, description, order, isActive } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();

    // Check if category with same name already exists
    const existingCategory = await NavbarCategory.findOne({ 
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
    });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 409 }
      );
    }

    // Create new category
    const category = new NavbarCategory({
      name: trimmedName,
      description: description?.trim() || '',
      order: typeof order === 'number' ? order : 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    await category.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Navbar category created successfully',
        data: category,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating navbar category:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      let errorMessage = 'Category with this name or slug already exists';
      
      // Check if it's a slug duplicate
      if (error.keyValue?.slug) {
        errorMessage = `A category with the slug "${error.keyValue.slug}" already exists. Try a different name.`;
      }
      // Check if it's a name duplicate
      else if (error.keyValue?.name) {
        errorMessage = `A category with the name "${error.keyValue.name}" already exists.`;
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
      { error: 'Failed to create navbar category' },
      { status: 500 }
    );
  }
}
