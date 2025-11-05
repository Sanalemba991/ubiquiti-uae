import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import SubCategory from '@/models/SubCategory';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Fetch all products (Admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const navbarCategoryId = searchParams.get('navbarCategory');
    const categoryId = searchParams.get('category');
    const subcategoryId = searchParams.get('subcategory');

    const query: any = {};
    if (navbarCategoryId) query.navbarCategory = navbarCategoryId;
    if (categoryId) query.category = categoryId;
    if (subcategoryId) query.subcategory = subcategoryId;

    const products = await Product.find(query)
      .populate('navbarCategory', 'name slug')
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: products, count: products.length });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST - Create product (Admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { name, description, keyFeatures, image1, image2, image3, image4, navbarCategory, category, subcategory, isActive } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }
    if (!description || !description.trim()) {
      return NextResponse.json({ error: 'Product description is required' }, { status: 400 });
    }
    if (!image1 || !image1.trim()) {
      return NextResponse.json({ error: 'At least one product image is required' }, { status: 400 });
    }
    if (!navbarCategory) {
      return NextResponse.json({ error: 'Navbar category is required' }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    // Verify category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Verify subcategory if provided
    if (subcategory) {
      const subcategoryDoc = await SubCategory.findById(subcategory);
      if (!subcategoryDoc) {
        return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
      }
      // Verify subcategory belongs to the selected category
      if (subcategoryDoc.category.toString() !== category) {
        return NextResponse.json({ error: 'Subcategory does not belong to the selected category' }, { status: 400 });
      }
    }

    const trimmedName = name.trim();

    // Check for duplicate name in same category/subcategory
    const duplicateQuery: any = { 
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
      category 
    };
    if (subcategory) duplicateQuery.subcategory = subcategory;
    
    const existing = await Product.findOne(duplicateQuery);
    if (existing) {
      return NextResponse.json({ error: 'Product with this name already exists in this category' }, { status: 409 });
    }

    const product = new Product({
      name: trimmedName,
      description: description.trim(),
      keyFeatures: keyFeatures || [],
      image1: image1.trim(),
      image2: image2?.trim() || '',
      image3: image3?.trim() || '',
      image4: image4?.trim() || '',
      navbarCategory,
      category,
      subcategory: subcategory || null,
      isActive: isActive !== undefined ? isActive : true,
    });

    await product.save();
    await product.populate([
      { path: 'navbarCategory', select: 'name slug' },
      { path: 'category', select: 'name slug' },
      { path: 'subcategory', select: 'name slug' }
    ]);

    return NextResponse.json({ success: true, message: 'Product created successfully', data: product }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Duplicate product slug' }, { status: 409 });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
