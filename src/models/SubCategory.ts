import mongoose, { Schema } from 'mongoose';

const subCategorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Sub-category name is required'],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Parent category is required']
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
    }
}, {
    timestamps: true
});

// Create compound index for category + slug
subCategorySchema.index({ category: 1, slug: 1 });
subCategorySchema.index({ category: 1, isActive: 1 });

// Auto-generate slug from name before validation
subCategorySchema.pre('validate', function(next) {
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
subCategorySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});

const SubCategory = mongoose.models.SubCategory || mongoose.model('SubCategory', subCategorySchema);
export default SubCategory;
