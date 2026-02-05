'use client';

import { useState, useEffect, memo } from 'react';
import { FaBox, FaEnvelope, FaPhone, FaLayerGroup, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';
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
    productEnquiriesTrend: Array<{ id: string; count: number }>;
    contactEnquiriesTrend: Array<{ id: string; count: number }>;
    productsByCategory: Array<{ id: string; count: number }>;
  };
  recentActivity: {
    products: Array<{ type: string; title: string; date: string }>;
    productEnquiries: Array<{ type: string; title: string; subtitle: string; date: string }>;
    contactEnquiries: Array<{ type: string; title: string; subtitle: string; date: string }>;
  };
}

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#1d4ed8', '#2563eb', '#1e40af'];

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 dark:text-gray-400">Failed to load dashboard data</p>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Products',
      value: dashboardData.overview?.totalProducts || 0,
      icon: FaBox,
      color: 'bg-blue-500',
    },
    {
      name: 'Product Enquiries',
      value: dashboardData.overview?.totalProductEnquiries || 0,
      change: dashboardData.overview?.productEnquiryGrowth,
      icon: FaEnvelope,
      color: 'bg-blue-600',
    },
    {
      name: 'Contact Enquiries',
      value: dashboardData.overview?.totalContactEnquiries || 0,
      change: dashboardData.overview?.contactEnquiryGrowth,
      icon: FaPhone,
      color: 'bg-blue-700',
    },
    {
      name: 'Total Categories',
      value: dashboardData.overview?.totalCategories || 0,
      icon: FaLayerGroup,
      color: 'bg-blue-800',
    },
  ];

  const trendData = (dashboardData.charts?.productEnquiriesTrend || []).map((item, index) => ({
    date: new Date(item.id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    productEnquiries: item.count,
    contactEnquiries: dashboardData.charts?.contactEnquiriesTrend?.[index]?.count || 0,
  }));

  const statusData = [
    { name: 'Pending', value: dashboardData.enquiries?.statusDistribution?.pending || 0, color: '#fbbf24' },
    { name: 'Contacted', value: dashboardData.enquiries?.statusDistribution?.contacted || 0, color: '#3b82f6' },
    { name: 'Resolved', value: dashboardData.enquiries?.statusDistribution?.resolved || 0, color: '#22c55e' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/25">
        <h1 className="text-2xl font-bold mb-1">Welcome Back!</h1>
        <p className="text-blue-100">Here&apos;s your dashboard overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change && stat.change.startsWith('+');
          
          return (
            <div 
              key={stat.name}
              className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
                  <Icon className="text-white" />
                </div>
                {stat.change && (
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    isPositive 
                      ? 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' 
                      : 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <FaClock className="text-2xl text-yellow-500" />
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full">Pending</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{dashboardData.enquiries?.statusDistribution?.pending || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Awaiting Response</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <FaExclamationCircle className="text-2xl text-blue-500" />
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">In Progress</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{dashboardData.enquiries?.statusDistribution?.contacted || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Being Handled</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <FaCheckCircle className="text-2xl text-green-500" />
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">Resolved</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{dashboardData.enquiries?.statusDistribution?.resolved || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enquiries Trend */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Enquiries Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorProduct" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorContact" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="date" className="text-xs" stroke="#9ca3af" />
              <YAxis className="text-xs" stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tooltip-bg, #fff)', 
                  border: '1px solid var(--tooltip-border, #e5e7eb)',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Area type="monotone" dataKey="productEnquiries" stroke="#3b82f6" fillOpacity={1} fill="url(#colorProduct)" name="Product" />
              <Area type="monotone" dataKey="contactEnquiries" stroke="#60a5fa" fillOpacity={1} fill="url(#colorContact)" name="Contact" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Status Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button 
            onClick={() => window.location.href = '/admin/dashboard/products'}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/25"
          >
            <FaBox />
            <span>Manage Products</span>
          </button>
          <button 
            onClick={() => window.location.href = '/admin/dashboard/category'}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/25"
          >
            <FaLayerGroup />
            <span>Manage Categories</span>
          </button>
          <button 
            onClick={() => window.location.href = '/admin/dashboard/product-enquiry'}
            className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-lg shadow-blue-700/25"
          >
            <FaEnvelope />
            <span>View Enquiries</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(DashboardPage);
