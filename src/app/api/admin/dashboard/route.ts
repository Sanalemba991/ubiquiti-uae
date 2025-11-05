import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyAdminAuth } from '@/lib/auth-helpers';
import Product from '@/models/Product';
import ProductEnquiry from '@/models/ProductEnquiry';
import ContactEnquiry from '@/models/ContactEnquiry';
import Category from '@/models/Category';
import SubCategory from '@/models/SubCategory';
import NavbarCategory from '@/models/NavbarCategory';

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = verifyAdminAuth(req);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Fetch all counts
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalProductEnquiries,
      pendingProductEnquiries,
      contactedProductEnquiries,
      resolvedProductEnquiries,
      totalContactEnquiries,
      pendingContactEnquiries,
      contactedContactEnquiries,
      resolvedContactEnquiries,
      totalNavbarCategories,
      totalCategories,
      totalSubCategories,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: false }),
      ProductEnquiry.countDocuments(),
      ProductEnquiry.countDocuments({ status: 'pending' }),
      ProductEnquiry.countDocuments({ status: 'contacted' }),
      ProductEnquiry.countDocuments({ status: 'resolved' }),
      ContactEnquiry.countDocuments(),
      ContactEnquiry.countDocuments({ status: 'pending' }),
      ContactEnquiry.countDocuments({ status: 'contacted' }),
      ContactEnquiry.countDocuments({ status: 'resolved' }),
      NavbarCategory.countDocuments(),
      Category.countDocuments(),
      SubCategory.countDocuments(),
    ]);

    // Get recent products (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Get product enquiries by date (last 30 days for chart)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const productEnquiriesByDate = await ProductEnquiry.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const contactEnquiriesByDate = await ContactEnquiry.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get products by category for pie chart
    const productsByCategory = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      {
        $group: {
          _id: '$categoryInfo.name',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get recent activity (last 10 items)
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt')
      .lean();

    const recentProductEnquiries = await ProductEnquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('productName name createdAt')
      .lean();

    const recentContactEnquiries = await ContactEnquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name subject createdAt')
      .lean();

    // Calculate growth percentages (comparing to previous period)
    const previousThirtyDaysAgo = new Date();
    previousThirtyDaysAgo.setDate(previousThirtyDaysAgo.getDate() - 60);

    const previousProductEnquiries = await ProductEnquiry.countDocuments({
      createdAt: { $gte: previousThirtyDaysAgo, $lt: thirtyDaysAgo }
    });

    const currentProductEnquiries = await ProductEnquiry.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const previousContactEnquiries = await ContactEnquiry.countDocuments({
      createdAt: { $gte: previousThirtyDaysAgo, $lt: thirtyDaysAgo }
    });

    const currentContactEnquiries = await ContactEnquiry.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const productEnquiryGrowthNum = previousProductEnquiries > 0
      ? parseFloat(((currentProductEnquiries - previousProductEnquiries) / previousProductEnquiries * 100).toFixed(1))
      : currentProductEnquiries > 0 ? 100 : 0;

    const contactEnquiryGrowthNum = previousContactEnquiries > 0
      ? parseFloat(((currentContactEnquiries - previousContactEnquiries) / previousContactEnquiries * 100).toFixed(1))
      : currentContactEnquiries > 0 ? 100 : 0;

    // Get enquiry status distribution
    const enquiryStatusDistribution = {
      pending: pendingProductEnquiries + pendingContactEnquiries,
      contacted: contactedProductEnquiries + contactedContactEnquiries,
      resolved: resolvedProductEnquiries + resolvedContactEnquiries,
    };

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          activeProducts,
          inactiveProducts,
          totalProductEnquiries,
          totalContactEnquiries,
          totalEnquiries: totalProductEnquiries + totalContactEnquiries,
          totalCategories: totalNavbarCategories + totalCategories + totalSubCategories,
          productEnquiryGrowth: `${productEnquiryGrowthNum > 0 ? '+' : ''}${productEnquiryGrowthNum}%`,
          contactEnquiryGrowth: `${contactEnquiryGrowthNum > 0 ? '+' : ''}${contactEnquiryGrowthNum}%`,
        },
        enquiries: {
          product: {
            total: totalProductEnquiries,
            pending: pendingProductEnquiries,
            contacted: contactedProductEnquiries,
            resolved: resolvedProductEnquiries,
          },
          contact: {
            total: totalContactEnquiries,
            pending: pendingContactEnquiries,
            contacted: contactedContactEnquiries,
            resolved: resolvedContactEnquiries,
          },
          statusDistribution: enquiryStatusDistribution,
        },
        charts: {
          productEnquiriesTrend: productEnquiriesByDate,
          contactEnquiriesTrend: contactEnquiriesByDate,
          productsByCategory,
        },
        recentActivity: {
          products: recentProducts.map(p => ({
            type: 'product',
            title: p.name,
            date: p.createdAt,
          })),
          productEnquiries: recentProductEnquiries.map(e => ({
            type: 'product_enquiry',
            title: `Enquiry for ${e.productName}`,
            subtitle: `by ${e.name}`,
            date: e.createdAt,
          })),
          contactEnquiries: recentContactEnquiries.map(e => ({
            type: 'contact_enquiry',
            title: e.subject,
            subtitle: `by ${e.name}`,
            date: e.createdAt,
          })),
        },
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
