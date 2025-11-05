import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import NavbarCategory from '@/models/NavbarCategory';
import { verifyAdminAuth } from '@/lib/auth-helpers';
import mongoose from 'mongoose';

// GET - Fetch a single category by ID (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find category by ID
    const category = await Category.findById(id).populate('navbarCategory', 'name slug');

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT - Update a category (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();
    const { name, navbarCategory, description, image, order, isActive } = body;

    // Find existing category
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if name is being changed
    if (name && name.trim()) {
      const trimmedName = name.trim();
      if (trimmedName !== category.name) {
        // Check for duplicate name in the same navbar category
        const navbarCatId = navbarCategory || category.navbarCategory;
        const existingCategory = await Category.findOne({
          name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
          navbarCategory: navbarCatId,
          _id: { $ne: id }
        });
        
        if (existingCategory) {
          return NextResponse.json(
            { error: 'Category with this name already exists in this navbar category' },
            { status: 409 }
          );
        }
        category.name = trimmedName;
      }
    }

    // Validate navbar category if changed
    if (navbarCategory && navbarCategory !== category.navbarCategory.toString()) {
      const navbarCat = await NavbarCategory.findById(navbarCategory);
      if (!navbarCat) {
        return NextResponse.json(
          { error: 'Navbar category not found' },
          { status: 404 }
        );
      }
      category.navbarCategory = navbarCategory;
    }

    // Update other fields
    if (description !== undefined) category.description = description?.trim() || '';
    if (image !== undefined) category.image = image?.trim() || '';
    if (order !== undefined) category.order = typeof order === 'number' ? order : 0;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    // Populate navbar category before returning
    await category.populate('navbarCategory', 'name slug');

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    
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
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find and delete category
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
