import { NextRequest, NextResponse } from 'next/server';
import ContactEnquiryModel from '@/models/ContactEnquiry';
import NotificationModel from '@/models/Notification';

// POST - Create a new contact enquiry (Public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create the enquiry
    const enquiry = await ContactEnquiryModel.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    });

    // Create notification for admin
    await NotificationModel.create({
      title: 'New Contact Enquiry',
      message: `${name} submitted a contact enquiry: "${subject}"`,
      type: 'contact_enquiry',
      icon: 'mail',
      link: `/admin/dashboard/contact-enquiry`,
      related_id: enquiry.id,
      urgent: false
    });

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: enquiry
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
