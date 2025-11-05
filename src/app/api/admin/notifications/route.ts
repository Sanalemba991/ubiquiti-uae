import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyAdminAuth } from '@/lib/auth-helpers';
import ProductEnquiry from '@/models/ProductEnquiry';
import ContactEnquiry from '@/models/ContactEnquiry';
import Notification from '@/models/Notification';

interface NotificationResponse {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  read: boolean;
  link?: string;
}

// GET - Fetch notifications from database
export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = verifyAdminAuth(req);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Fetch notifications from database
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Transform to response format
    const notificationResponses: NotificationResponse[] = notifications.map((notif: any) => ({
      id: notif._id.toString(),
      type: notif.type,
      title: notif.title,
      message: notif.message,
      time: new Date(notif.createdAt).toISOString(),
      icon: notif.icon,
      read: notif.read,
      link: notif.link
    }));

    // Get pending enquiry counts
    const pendingProductEnquiries = await ProductEnquiry.countDocuments({ status: 'pending' });
    const pendingContactEnquiries = await ContactEnquiry.countDocuments({ status: 'pending' });

    return NextResponse.json({
      success: true,
      data: {
        notifications: notificationResponses,
        unreadCount: notifications.filter((n: any) => !n.read).length,
        pendingEnquiries: pendingProductEnquiries + pendingContactEnquiries,
      },
    });
  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST - Create a new notification
export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = verifyAdminAuth(req);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { title, message, type, icon, link, urgent, relatedId } = body;

    if (!title || !message || !type || !icon) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, message, type, icon' },
        { status: 400 }
      );
    }

    const notification = await Notification.create({
      title,
      message,
      type,
      icon,
      link,
      urgent: urgent || false,
      relatedId,
      read: false
    });

    return NextResponse.json({
      success: true,
      data: {
        notification: {
          id: notification._id.toString(),
          type: notification.type,
          title: notification.title,
          message: notification.message,
          time: notification.createdAt.toISOString(),
          icon: notification.icon,
          read: notification.read,
          link: notification.link
        }
      }
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// PUT - Mark notification(s) as read
export async function PUT(req: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = verifyAdminAuth(req);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { id, markAll } = body;

    if (markAll) {
      // Mark all notifications as read
      const result = await Notification.updateMany(
        { read: false },
        { $set: { read: true } }
      );

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
        data: {
          modifiedCount: result.modifiedCount
        }
      });
    } else if (id) {
      // Mark specific notification as read
      const notification = await Notification.findByIdAndUpdate(
        id,
        { $set: { read: true } },
        { new: true }
      );

      if (!notification) {
        return NextResponse.json(
          { success: false, error: 'Notification not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Notification marked as read',
        data: { notification }
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Missing required field: id or markAll' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
}

// DELETE - Clear all notifications
export async function DELETE(req: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = verifyAdminAuth(req);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const result = await Notification.deleteMany({});

    return NextResponse.json({
      success: true,
      message: 'All notifications cleared',
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear notifications' },
      { status: 500 }
    );
  }
}
