import mongoose, { Schema } from 'mongoose';

// Drop existing model if it exists to ensure schema changes take effect
if (mongoose.models.Notification) {
  delete mongoose.models.Notification;
}

const notificationSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['product', 'product_enquiry', 'contact_enquiry', 'category', 'subcategory', 'navbar_category', 'info', 'success', 'warning', 'error'],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: false
  },
  read: {
    type: Boolean,
    default: false
  },
  urgent: {
    type: Boolean,
    default: false
  },
  relatedId: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Index for better query performance
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ read: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
