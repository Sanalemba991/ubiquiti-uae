'use client';

import { useState, useEffect, memo } from 'react';
import { FaBox, FaEnvelope, FaPhone, FaLayerGroup, FaChartLine, FaUsers, FaTachometerAlt, FaStar, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';
import Image from 'next/image';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';

interface DashboardData {
  overview: {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    totalProductEnquiries: number;
    totalContactEnquiries: number;
    totalEnquiries: number;
    totalCategories: number;
    productEnquiryGrowth: string;
    contactEnquiryGrowth: string;
  };
  enquiries: {
    product: {
      total: number;
      pending: number;
      contacted: number;
      resolved: number;
    };
    contact: {
      total: number;
      pending: number;
      contacted: number;
      resolved: number;
    };
    statusDistribution: {
      pending: number;
      contacted: number;
      resolved: number;
    };
  };
  charts: {
    productEnquiriesTrend: Array<{ _id: string; count: number }>;
    contactEnquiriesTrend: Array<{ _id: string; count: number }>;
    productsByCategory: Array<{ _id: string; count: number }>;
  };
  recentActivity: {
    products: Array<{ type: string; title: string; date: string }>;
    productEnquiries: Array<{ type: string; title: string; subtitle: string; date: string }>;
    contactEnquiries: Array<{ type: string; title: string; subtitle: string; date: string }>;
  };
}

// Chart Colors - Professional Grey Theme
const COLORS = ['#64748b', '#94a3b8', '#475569', '#cbd5e1', '#1e293b', '#334155'];

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
        <p className="text-white text-sm font-semibold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs text-slate-400">
            {entry.name}: <span className="text-slate-200 font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Memoized Stat Card Component
const StatCard = memo(({ stat }: { stat: any }) => {
  const Icon = stat.icon;
  const isPositive = stat.change && stat.change.startsWith('+');
  
  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl hover:border-slate-600/50 hover:bg-slate-900/80 transition-all duration-300 p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
          <Icon className="text-xl md:text-2xl text-white" />
        </div>
        {stat.change && (
          <span className={`text-xs md:text-sm font-semibold px-2 md:px-3 py-1 rounded-full ${
            isPositive 
              ? 'text-green-400 bg-green-500/10 border border-green-500/20' 
              : 'text-red-400 bg-red-500/10 border border-red-500/20'
          }`}>
            {stat.change}
          </span>
        )}
      </div>
      <h3 className="text-slate-400 text-xs md:text-sm font-medium mb-1">{stat.name}</h3>
      <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
    </div>
  );
});
StatCard.displayName = 'StatCard';

// Memoized Activity Item
const ActivityItem = memo(({ activity }: { activity: any }) => {
  const getIcon = () => {
    switch (activity.type) {
      case 'product':
        return <FaBox className="text-slate-400" />;
      case 'product_enquiry':
        return <FaEnvelope className="text-slate-400" />;
      case 'contact_enquiry':
        return <FaPhone className="text-slate-400" />;
      default:
        return <FaChartLine className="text-slate-400" />;
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now.getTime() - activityDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="flex items-start space-x-3 md:space-x-4 p-3 md:p-4 bg-slate-950/60 rounded-xl hover:bg-slate-800/60 border border-slate-800/50 hover:border-slate-600/50 transition duration-200">
      <div className="mt-1 flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start md:items-center justify-between gap-2">
          <h4 className="text-xs md:text-sm font-semibold text-white">{activity.title}</h4>
          <span className="text-xs text-slate-500 whitespace-nowrap">{getTimeAgo(activity.date)}</span>
        </div>
        {activity.subtitle && (
          <p className="text-xs md:text-sm text-slate-400 mt-1">{activity.subtitle}</p>
        )}
      </div>
    </div>
  );
});
ActivityItem.displayName = 'ActivityItem';

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/dashboard');
      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
      } else {
        toast.error('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error loading dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400">Failed to load dashboard data</p>
      </div>
    );
  }

  // Prepare stats
  const stats = [
    {
      name: 'Total Products',
      value: dashboardData.overview.totalProducts.toString(),
      change: null,
      icon: FaBox,
      color: 'from-slate-600 to-slate-700',
    },
    {
      name: 'Product Enquiries',
      value: dashboardData.overview.totalProductEnquiries.toString(),
      change: dashboardData.overview.productEnquiryGrowth,
      icon: FaEnvelope,
      color: 'from-slate-500 to-slate-600',
    },
    {
      name: 'Contact Enquiries',
      value: dashboardData.overview.totalContactEnquiries.toString(),
      change: dashboardData.overview.contactEnquiryGrowth,
      icon: FaPhone,
      color: 'from-slate-700 to-slate-800',
    },
    {
      name: 'Total Categories',
      value: dashboardData.overview.totalCategories.toString(),
      change: null,
      icon: FaLayerGroup,
      color: 'from-gray-600 to-gray-700',
    },
  ];

  // Prepare trend data
  const trendData = dashboardData.charts.productEnquiriesTrend.map((item, index) => ({
    date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    productEnquiries: item.count,
    contactEnquiries: dashboardData.charts.contactEnquiriesTrend[index]?.count || 0,
  }));

  // Prepare pie chart data
  const statusPieData = [
    { name: 'Pending', value: dashboardData.enquiries.statusDistribution.pending, color: '#94a3b8' },
    { name: 'Contacted', value: dashboardData.enquiries.statusDistribution.contacted, color: '#64748b' },
    { name: 'Resolved', value: dashboardData.enquiries.statusDistribution.resolved, color: '#475569' },
  ];

  const categoryPieData = dashboardData.charts.productsByCategory.map((item, index) => ({
    name: item._id,
    value: item.count,
    color: COLORS[index % COLORS.length],
  }));

  // Combine all recent activities
  const allActivities = [
    ...dashboardData.recentActivity.products,
    ...dashboardData.recentActivity.productEnquiries,
    ...dashboardData.recentActivity.contactEnquiries,
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-2xl shadow-2xl shadow-slate-900/50 p-6 md:p-8 text-white border border-slate-700/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back, Adeeb Jamil! 👋</h1>
            <p className="text-slate-300 text-sm md:text-base">Here&apos;s what&apos;s happening with your admin dashboard today.</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <FaTachometerAlt className="text-4xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.name} stat={stat} />
        ))}
      </div>

      {/* Enquiry Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg p-5 md:p-6 hover:border-slate-600/50 transition">
          <div className="flex items-center justify-between mb-3">
            <FaClock className="text-3xl text-slate-400" />
            <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full">Pending</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{dashboardData.enquiries.statusDistribution.pending}</p>
          <p className="text-sm text-slate-400">Awaiting Response</p>
        </div>
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg p-5 md:p-6 hover:border-slate-600/50 transition">
          <div className="flex items-center justify-between mb-3">
            <FaExclamationCircle className="text-3xl text-slate-400" />
            <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full">In Progress</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{dashboardData.enquiries.statusDistribution.contacted}</p>
          <p className="text-sm text-slate-400">Being Handled</p>
        </div>
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg p-5 md:p-6 hover:border-slate-600/50 transition">
          <div className="flex items-center justify-between mb-3">
            <FaCheckCircle className="text-3xl text-slate-400" />
            <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full">Resolved</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{dashboardData.enquiries.statusDistribution.resolved}</p>
          <p className="text-sm text-slate-400">Completed</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Enquiries Trend Line Chart */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-white mb-4">Enquiries Trend (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorProduct" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorContact" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              <Area type="monotone" dataKey="productEnquiries" stroke="#64748b" fillOpacity={1} fill="url(#colorProduct)" name="Product Enquiries" />
              <Area type="monotone" dataKey="contactEnquiries" stroke="#94a3b8" fillOpacity={1} fill="url(#colorContact)" name="Contact Enquiries" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Products by Category Pie Chart */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-white mb-4">Products by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enquiry Status Distribution Bar Chart */}
      <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg p-5 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-white mb-4">Enquiry Status Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusPieData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Count" radius={[8, 8, 0, 0]}>
              {statusPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg p-5 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-white">Recent Activity</h2>
            <span className="text-xs md:text-sm text-slate-400">Last 30 days</span>
          </div>
          <div className="space-y-3 md:space-y-4">
            {allActivities.length > 0 ? (
              allActivities.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))
            ) : (
              <p className="text-center text-slate-400 py-8">No recent activity</p>
            )}
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-4 md:space-y-6">
          {/* Quick Actions */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-2 md:space-y-3">
              <button 
                onClick={() => window.location.href = '/admin/dashboard/products'}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-slate-700 to-slate-800 text-white py-2.5 md:py-3 rounded-xl hover:from-slate-600 hover:to-slate-700 transition duration-200 shadow-lg shadow-slate-900/50 text-sm md:text-base border border-slate-600/50"
              >
                <FaBox className="text-sm md:text-base" />
                <span>Manage Products</span>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/dashboard/category'}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-slate-700 to-slate-800 text-white py-2.5 md:py-3 rounded-xl hover:from-slate-600 hover:to-slate-700 transition duration-200 shadow-lg shadow-slate-900/50 text-sm md:text-base border border-slate-600/50"
              >
                <FaLayerGroup className="text-sm md:text-base" />
                <span>Manage Categories</span>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/dashboard/product-enquiry'}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-slate-700 to-slate-800 text-white py-2.5 md:py-3 rounded-xl hover:from-slate-600 hover:to-slate-700 transition duration-200 shadow-lg shadow-slate-900/50 text-sm md:text-base border border-slate-600/50"
              >
                <FaEnvelope className="text-sm md:text-base" />
                <span>View Enquiries</span>
              </button>
            </div>
          </div>

          {/* Admin Profile Card */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg p-5 md:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg shadow-slate-900/50">
                <FaUsers className="text-white text-2xl" />
              </div>
              <div>
                <p className="text-base font-bold text-white">Adeeb Jamil</p>
                <p className="text-xs text-slate-400">Backend Developer</p>
              </div>
            </div>
            <div className="text-xs text-slate-400 space-y-2 p-3 bg-slate-950/60 rounded-lg">
              <p className="flex items-center"><span className="mr-2">📧</span> admin@ubiquiti.com</p>
              <p className="flex items-center"><span className="mr-2">🔐</span> JWT Auth Active</p>
              <p className="flex items-center"><span className="mr-2">⏰</span> {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-2xl shadow-2xl shadow-slate-900/50 overflow-hidden border border-slate-700/50">
        <div className="relative h-48 md:h-56">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center text-white">
              <FaChartLine className="text-5xl md:text-6xl mx-auto mb-4 drop-shadow-2xl" />
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Real-Time Analytics</h3>
              <p className="text-sm md:text-base text-slate-300">Track your business performance with live data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(DashboardPage);
