import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import NavbarCategory from '@/models/NavbarCategory';

// GET - Fetch all active navbar categories (Public)
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Fetch only active categories sorted by order
    const categories = await NavbarCategory.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select('name slug description order');

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
