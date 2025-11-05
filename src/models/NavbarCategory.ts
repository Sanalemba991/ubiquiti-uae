import mongoose from 'mongoose';

const navbarCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
        trim: true,
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true
});

// Create slug from name before validation
navbarCategorySchema.pre('validate', function(next) {
    if (this.name && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }
    next();
});

// Also update slug when name changes
navbarCategorySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }
    next();
});

const NavbarCategory = mongoose.models.NavbarCategory || mongoose.model('NavbarCategory', navbarCategorySchema);

export default NavbarCategory;
