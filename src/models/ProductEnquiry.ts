import mongoose from 'mongoose';

const productEnquirySchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  description: {
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

const ProductEnquiry = mongoose.models.ProductEnquiry || mongoose.model('ProductEnquiry', productEnquirySchema);

export default ProductEnquiry;
