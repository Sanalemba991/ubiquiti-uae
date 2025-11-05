import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  keyFeatures: string[];
  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;
  navbarCategory: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
  },
  keyFeatures: {
    type: [String],
    default: [],
  },
  image1: {
    type: String,
    required: [true, 'At least one product image is required'],
  },
  image2: {
    type: String,
    default: '',
  },
  image3: {
    type: String,
    default: '',
  },
  image4: {
    type: String,
    default: '',
  },
  navbarCategory: {
    type: Schema.Types.ObjectId,
    ref: 'NavbarCategory',
    required: [true, 'Navbar category is required'],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'SubCategory',
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for better query performance
productSchema.index({ navbarCategory: 1, category: 1, subcategory: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });

// Pre-validate middleware to generate slug
productSchema.pre('validate', function(next) {
  if (this.isNew || this.isModified('name')) {
    if (!this.slug || this.slug === '') {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
  }
  next();
});

// Pre-save middleware to update timestamps
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Drop existing model if it exists to ensure schema changes take effect
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
