'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FaTachometerAlt, 
  FaBars, 
  FaTimes,
  FaSignOutAlt,
  FaList,
  FaSitemap,
  FaBox,
  FaEnvelope,
  FaPhone,
  FaMoon,
  FaSun,
  FaBell
} from 'react-icons/fa';

const navLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: FaTachometerAlt },
  { name: 'Navbar Category', href: '/admin/dashboard/navbar-category', icon: FaBars },
  { name: 'Category', href: '/admin/dashboard/category', icon: FaList },
  { name: 'Sub Category', href: '/admin/dashboard/sub-category', icon: FaSitemap },
  { name: 'Products', href: '/admin/dashboard/products', icon: FaBox },
  { name: 'Product Enquiry', href: '/admin/dashboard/product-enquiry', icon: FaEnvelope },
  { name: 'Contact Enquiry', href: '/admin/dashboard/contact-enquiry', icon: FaPhone },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('dashboardTheme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    localStorage.setItem('dashboardTheme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/notifications');
      const result = await response.json();
      
      if (result.success) {
        setNotifications(result.data.notifications || []);
        setUnreadCount(result.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 30000);
    return () => clearInterval(timer);
  }, [fetchNotifications]);

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`h-screen overflow-hidden transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-950 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 flex flex-col transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${
        isDarkMode 
          ? 'bg-gray-900 border-r border-gray-800' 
          : 'bg-white border-r border-gray-200 shadow-lg'
      }`}>
        {/* Sidebar Header */}
        <div className={`h-16 flex-shrink-0 flex items-center justify-between px-4 border-b ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <FaTachometerAlt className="text-white text-sm" />
            </div>
            <span className="font-bold text-lg">Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : isDarkMode 
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="text-lg" />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className={`flex-shrink-0 p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isDarkMode 
                ? 'text-gray-400 hover:bg-red-500/10 hover:text-red-400' 
                : 'text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 h-screen flex flex-col">
        {/* Top Header */}
        <header className={`flex-shrink-0 h-16 flex items-center justify-between px-4 lg:px-6 border-b ${
          isDarkMode 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-gray-200 shadow-sm'
        }`}>
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <FaBars className="text-xl" />
          </button>

          {/* Page Title */}
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold">
              {navLinks.find(l => l.href === pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-xl transition-all duration-200 relative ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FaBell className="text-lg" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-xl border overflow-hidden ${
                  isDarkMode 
                    ? 'bg-gray-900 border-gray-800' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notif, index) => (
                        <div 
                          key={index}
                          className={`px-4 py-3 border-b last:border-0 ${
                            isDarkMode ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'
                          } transition`}
                        >
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {notif.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className={`px-4 py-8 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <FaBell className="text-3xl mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
            }`}>
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Close notifications when clicking outside */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-20"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}
