import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactEnquiry from '@/models/ContactEnquiry';

// POST - Create new contact enquiry (public)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
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
    const enquiry = await ContactEnquiry.create({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json(
      { 
        success: true,
        message: 'Thank you for contacting us! We will get back to you soon.',
        enquiry 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating contact enquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
