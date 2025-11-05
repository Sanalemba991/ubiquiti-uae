import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProductEnquiry from '@/models/ProductEnquiry';

// POST - Create new product enquiry (public)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { productName, name, email, mobile, description } = body;

    // Validation
    if (!productName || !name || !email || !mobile || !description) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create enquiry
    const enquiry = await ProductEnquiry.create({
      productName,
      name,
      email,
      mobile,
      description,
    });

    return NextResponse.json(
      { 
        message: 'Enquiry submitted successfully! We will contact you soon.',
        enquiry 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
