import mongoose, { Schema } from 'mongoose';

// Drop existing model if it exists to ensure schema changes take effect
if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  navbarCategory: {
    type: Schema.Types.ObjectId,
    ref: 'NavbarCategory',
    required: [true, 'Navbar category is required']
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  image: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create slug from name before validation
categorySchema.pre('validate', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Update slug when name changes
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Index for better query performance
categorySchema.index({ name: 1, navbarCategory: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ navbarCategory: 1, order: 1 });

const Category = mongoose.model('Category', categorySchema);
export default Category;
