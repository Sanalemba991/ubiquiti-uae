import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import NavbarCategory from '@/models/NavbarCategory';
import { verifyAdminAuth } from '@/lib/auth-helpers';
import mongoose from 'mongoose';

// GET - Fetch a single navbar category by ID (Admin only)
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
    const category = await NavbarCategory.findById(id);

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
    console.error('Error fetching navbar category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navbar category' },
      { status: 500 }
    );
  }
}

// PUT - Update a navbar category (Admin only)
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
    const { name, description, order, isActive } = body;

    // Find existing category
    const category = await NavbarCategory.findById(id);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if name is being changed to an existing name
    if (name && name.trim()) {
      const trimmedName = name.trim();
      if (trimmedName !== category.name) {
        const existingCategory = await NavbarCategory.findOne({ 
          name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
          _id: { $ne: id }
        });
        if (existingCategory) {
          return NextResponse.json(
            { error: 'Category with this name already exists' },
            { status: 409 }
          );
        }
        category.name = trimmedName;
      }
    }

    // Update other fields
    if (description !== undefined) category.description = description?.trim() || '';
    if (order !== undefined) category.order = typeof order === 'number' ? order : 0;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return NextResponse.json({
      success: true,
      message: 'Navbar category updated successfully',
      data: category,
    });
  } catch (error: any) {
    console.error('Error updating navbar category:', error);
    
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
      { error: 'Failed to update navbar category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a navbar category (Admin only)
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
    const category = await NavbarCategory.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Navbar category deleted successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error deleting navbar category:', error);
    return NextResponse.json(
      { error: 'Failed to delete navbar category' },
      { status: 500 }
    );
  }
}
