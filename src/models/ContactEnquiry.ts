import mongoose from 'mongoose';

const contactEnquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'resolved'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const ContactEnquiry = mongoose.models.ContactEnquiry || mongoose.model('ContactEnquiry', contactEnquirySchema);

export default ContactEnquiry;
