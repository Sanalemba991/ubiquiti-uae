import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import SubCategory from '@/models/SubCategory';
import { verifyAdminAuth } from '@/lib/auth-helpers';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    await connectDB();
    const product = await Product.findById(id)
      .populate('navbarCategory', 'name slug')
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug');
    
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    await connectDB();

    const body = await request.json();
    const { name, description, keyFeatures, image1, image2, image3, image4, navbarCategory, category, subcategory, isActive } = body;

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    // Verify category if changed
    if (category && category !== product.category.toString()) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Verify subcategory if provided
    if (subcategory) {
      const subcategoryDoc = await SubCategory.findById(subcategory);
      if (!subcategoryDoc) return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
      
      const targetCategory = category || product.category.toString();
      if (subcategoryDoc.category.toString() !== targetCategory) {
        return NextResponse.json({ error: 'Subcategory does not belong to the selected category' }, { status: 400 });
      }
    }

    // Check for duplicate name
    if (name && name.trim() && name.trim() !== product.name) {
      const duplicateQuery: any = {
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
        category: category || product.category,
        _id: { $ne: id }
      };
      if (subcategory) duplicateQuery.subcategory = subcategory;
      
      const existing = await Product.findOne(duplicateQuery);
      if (existing) {
        return NextResponse.json({ error: 'Product with this name already exists in this category' }, { status: 409 });
      }
      product.name = name.trim();
    }

    if (description !== undefined) product.description = description.trim();
    if (keyFeatures !== undefined) product.keyFeatures = keyFeatures;
    if (image1 !== undefined) product.image1 = image1.trim();
    if (image2 !== undefined) product.image2 = image2?.trim() || '';
    if (image3 !== undefined) product.image3 = image3?.trim() || '';
    if (image4 !== undefined) product.image4 = image4?.trim() || '';
    if (navbarCategory !== undefined) product.navbarCategory = navbarCategory;
    if (category !== undefined) product.category = category;
    if (subcategory !== undefined) product.subcategory = subcategory || null;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();
    await product.populate([
      { path: 'navbarCategory', select: 'name slug' },
      { path: 'category', select: 'name slug' },
      { path: 'subcategory', select: 'name slug' }
    ]);

    return NextResponse.json({ success: true, message: 'Product updated successfully', data: product });
  } catch (error: any) {
    console.error('Error updating product:', error);
    if (error.code === 11000) return NextResponse.json({ error: 'Duplicate slug' }, { status: 409 });
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    await connectDB();
    const product = await Product.findByIdAndDelete(id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Product deleted successfully', data: product });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
