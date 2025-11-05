# Admin Dashboard - Quick Reference Guide

## 🔐 Admin Credentials
- **Username:** `admin` (from .env.local)
- **Password:** `securepassword123` (from .env.local)
- **Admin Name:** Adeeb Jamil
- **Role:** Backend Developer

## 🚀 Features Implemented

### 1. Authentication System
- ✅ JWT Token-based authentication
- ✅ Secure HTTP-only cookies
- ✅ Protected routes with middleware
- ✅ Auto-redirect if already logged in
- ✅ Session expiry (24 hours)

### 2. Login Page (`/admin`)
- Modern gradient design
- Toast notifications (react-toastify)
- Loading states
- Responsive layout
- Auto-redirect after successful login

### 3. Dashboard Layout
- **Sidebar Navigation** with 7 links:
  1. Dashboard
  2. Navbar Category
  3. Category
  4. Sub Category
  5. Products
  6. Product Enquiry
  7. Contact Enquiry

- **Header Features:**
  - Live date and time display (updates every second)
  - Welcome message with admin name
  - Mobile-responsive hamburger menu
  - Beautiful gradient styling

### 4. Dashboard Pages

#### Main Dashboard (`/admin/dashboard`)
- Overview statistics cards
- Recent activity feed
- Quick action buttons
- Admin profile card
- Analytics banner with Unsplash image

#### Navbar Category (`/admin/dashboard/navbar-category`)
- CRUD operations for navigation items
- Search functionality
- Status management (Visible/Hidden)
- Order management
- Statistics cards

#### Category (`/admin/dashboard/category`)
- Grid layout with images from Unsplash
- Product count per category
- Search and filter
- Beautiful card designs
- Comprehensive statistics

#### Sub Category (`/admin/dashboard/sub-category`)
- Table view with parent category relationships
- Product count tracking
- Search functionality
- Status management
- Statistics overview

#### Products (`/admin/dashboard/products`)
- Product inventory management
- Image thumbnails
- SKU tracking
- Stock status (In Stock/Low Stock/Out of Stock)
- Price management
- Category associations
- Advanced search and filters

#### Product Enquiry (`/admin/dashboard/product-enquiry`)
- Customer enquiry management
- Status tracking (New/In Progress/Resolved)
- Detailed customer information
- Product association
- Status change functionality
- Delete functionality
- Statistics dashboard

#### Contact Enquiry (`/admin/dashboard/contact-enquiry`)
- Contact form submissions
- Subject-based categorization
- Status management
- Grid layout for better visibility
- Customer details tracking
- Statistics overview

## 🎨 Design Features

### Icons
- React Icons library used throughout
- Consistent icon usage
- Color-coded status icons

### Colors & Gradients
- Purple and Blue primary gradient
- Status-based color coding:
  - Green: Success/In Stock/Resolved
  - Yellow: Warning/Low Stock/In Progress
  - Red: Error/Out of Stock
  - Blue: Info/New

### Images
- Unsplash integration for demo images
- Next.js Image optimization
- Responsive image handling

### Notifications
- React Toastify for toast messages
- Success/Error states
- Auto-dismiss functionality

## 📁 File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx (Login Page)
│   │   └── dashboard/
│   │       ├── layout.tsx (Dashboard Layout with Sidebar)
│   │       ├── page.tsx (Main Dashboard)
│   │       ├── navbar-category/
│   │       │   └── page.tsx
│   │       ├── category/
│   │       │   └── page.tsx
│   │       ├── sub-category/
│   │       │   └── page.tsx
│   │       ├── products/
│   │       │   └── page.tsx
│   │       ├── product-enquiry/
│   │       │   └── page.tsx
│   │       └── contact-enquiry/
│   │           └── page.tsx
│   └── api/
│       └── admin/
│           ├── login/
│           │   └── route.ts
│           └── logout/
│               └── route.ts
├── lib/
│   └── auth.ts (Authentication utilities)
└── middleware.ts (Route protection)
```

## 🔧 Technologies Used

- **Next.js 14+** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **JWT (jsonwebtoken)** - Token generation
- **bcryptjs** - Password hashing
- **js-cookie** - Cookie management

## 🚀 How to Use

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access the admin panel:**
   - Navigate to `http://localhost:3000/admin`

3. **Login with credentials:**
   - Username: `admin`
   - Password: `securepassword123`

4. **Explore the dashboard:**
   - All 7 navigation links are functional
   - Demo data is pre-populated
   - All CRUD operations show toast notifications

## 🔒 Security Features

- JWT token stored in HTTP-only cookies
- Middleware protection for all dashboard routes
- Auto-redirect for unauthorized access
- Secure password comparison (ready for bcrypt in production)
- Token expiry after 24 hours

## 📝 Notes

- All pages have demo data pre-populated
- CRUD operations currently update local state (no backend database yet)
- Toast notifications confirm all actions
- Responsive design works on mobile, tablet, and desktop
- Live clock in header updates every second
- Beautiful modern UI with gradients and shadows

## 🎯 Future Enhancements (Optional)

- Connect to a real database (MongoDB, PostgreSQL, etc.)
- Add image upload functionality
- Implement pagination for large datasets
- Add export to CSV/PDF functionality
- Email notifications for enquiries
- Multi-admin support with roles
- Activity logging
- Dashboard analytics charts

---

**Admin:** Adeeb Jamil | **Role:** Backend Developer
**System:** JWT-Secured Admin Dashboard
