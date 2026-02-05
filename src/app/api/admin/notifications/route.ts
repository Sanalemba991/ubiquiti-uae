import { NextRequest, NextResponse } from 'next/server';
import NotificationModel from '@/models/Notification';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Fetch all notifications (Admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const notifications = await NotificationModel.findAll({ limit: 50 });
    const unreadCount = await NotificationModel.count({ read: false });

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
      count: notifications.length,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// POST - Create notification (Admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, message, type, icon, link, urgent } = body;

    if (!title || !message || !type || !icon) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const notification = await NotificationModel.create({
      title,
      message,
      type,
      icon,
      link: link || null,
      urgent: urgent || false,
    });

    return NextResponse.json({
      success: true,
      message: 'Notification created successfully',
      data: notification,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

// PUT - Mark all notifications as read (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    await NotificationModel.markAllAsRead();

    return NextResponse.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}

// DELETE - Delete all read notifications (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    await NotificationModel.deleteAllRead();

    return NextResponse.json({
      success: true,
      message: 'Read notifications deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    return NextResponse.json({ error: 'Failed to delete notifications' }, { status: 500 });
  }
}
