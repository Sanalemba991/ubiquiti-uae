import { NextRequest, NextResponse } from 'next/server';
import ProductModel from '@/models/Product';
import ProductEnquiryModel from '@/models/ProductEnquiry';
import ContactEnquiryModel from '@/models/ContactEnquiry';
import CategoryModel from '@/models/Category';
import SubCategoryModel from '@/models/SubCategory';
import NavbarCategoryModel from '@/models/NavbarCategory';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET - Fetch dashboard statistics (Admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    // Get counts in parallel
    const [
      totalProducts,
      activeProducts,
      totalCategories,
      totalSubCategories,
      totalNavbarCategories,
      totalProductEnquiries,
      pendingProductEnquiries,
      totalContactEnquiries,
      pendingContactEnquiries,
    ] = await Promise.all([
      ProductModel.count(),
      ProductModel.count({ isActive: true }),
      CategoryModel.count(),
      SubCategoryModel.count(),
      NavbarCategoryModel.count(),
      ProductEnquiryModel.count(),
      ProductEnquiryModel.count({ status: 'pending' }),
      ContactEnquiryModel.count(),
      ContactEnquiryModel.count({ status: 'pending' }),
    ]);

    // Get recent enquiries
    const [recentProductEnquiries, recentContactEnquiries, recentProducts] = await Promise.all([
      ProductEnquiryModel.findAll({ limit: 5 }),
      ContactEnquiryModel.findAll({ limit: 5 }),
      ProductModel.findAll({ limit: 5 }),
    ]);

    // Get enquiries by date for charts
    const [productEnquiriesByDate, contactEnquiriesByDate] = await Promise.all([
      ProductEnquiryModel.getByDateRange(30),
      ContactEnquiryModel.getByDateRange(30),
    ]);

    // Get products by category
    const productsByCategory = await ProductModel.getProductsByCategory();

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          activeProducts,
          inactiveProducts: totalProducts - activeProducts,
          totalCategories,
          totalSubCategories,
          totalNavbarCategories,
          totalProductEnquiries,
          pendingProductEnquiries,
          totalContactEnquiries,
          pendingContactEnquiries,
        },
        recentActivity: {
          productEnquiries: recentProductEnquiries,
          contactEnquiries: recentContactEnquiries,
          products: recentProducts,
        },
        charts: {
          productEnquiriesByDate,
          contactEnquiriesByDate,
          productsByCategory,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
