import { NextRequest, NextResponse } from 'next/server';
import ProductEnquiryModel from '@/models/ProductEnquiry';
import NotificationModel from '@/models/Notification';

// POST - Create a new product enquiry (Public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName, name, email, mobile, description } = body;

    // Validate required fields
    if (!productName || !name || !email || !mobile || !description) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create the enquiry
    const enquiry = await ProductEnquiryModel.create({
      product_name: productName.trim(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      description: description.trim()
    });

    // Create notification for admin
    await NotificationModel.create({
      title: 'New Product Enquiry',
      message: `${name} enquired about "${productName}"`,
      type: 'product_enquiry',
      icon: 'package',
      link: `/admin/dashboard/product-enquiry`,
      related_id: enquiry.id,
      urgent: false
    });

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: enquiry
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
