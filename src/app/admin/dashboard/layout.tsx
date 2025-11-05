'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  FaTachometerAlt, 
  FaBars, 
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle, 
  FaUser,
  FaSignOutAlt,
  FaList,
  FaSitemap,
  FaBox,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaMoon,
  FaSun,
  FaBell
} from 'react-icons/fa';
// Removed toast imports - using notification panel instead

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingEnquiries, setPendingEnquiries] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('dashboardTheme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('dashboardTheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/notifications');
      const result = await response.json();
      
      if (result.success) {
        setNotifications(result.data.notifications);
        setUnreadCount(result.data.unreadCount);
        setPendingEnquiries(result.data.pendingEnquiries);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);

  // Fetch notifications on mount and every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(timer);
  }, [fetchNotifications]);

  // Update time every second (optimized)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (notificationOpen && !target.closest('.notification-panel') && !target.closest('.notification-button')) {
        setNotificationOpen(false);
      }
    };

    if (notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationOpen]);

  // Function to add new notification
  const addNotification = useCallback((type: 'success' | 'warning' | 'info', message: string) => {
    const newNotification = {
      id: Date.now().toString(),
      type,
      message,
      time: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });

      if (response.ok) {
        addNotification('success', '✅ Logged out successfully!');
        
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      }
    } catch (error) {
      console.error('Logout error:', error);
      addNotification('warning', '❌ Error logging out');
    }
  }, [router, addNotification]);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }, []);

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  }, []);

  const formatNotificationTime = useCallback((date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  return (
    <>
      <div className={`h-screen overflow-hidden transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-950' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 backdrop-blur-xl border-r transition-all duration-300 ease-in-out overflow-hidden flex flex-col ${
            isDarkMode 
              ? 'bg-slate-900/95 border-slate-800/50' 
              : 'bg-white/95 border-gray-200 shadow-xl'
          } ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Sidebar Header */}
          <div className={`h-20 flex items-center justify-between px-4 border-b transition-colors flex-shrink-0 ${
            isDarkMode ? 'border-slate-800/50' : 'border-gray-200'
          }`}>
            {!sidebarCollapsed && (
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent">Admin Panel</h2>
            )}
            <button
              onClick={() => setSidebarOpen(false)}
              className={`lg:hidden transition ${
                isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaTimes size={20} />
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`hidden lg:block p-2 rounded-lg transition ${
                isDarkMode 
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {sidebarCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
            </button>
          </div>

          {/* Navigation Links - Scrollable Container */}
          <nav className="mt-6 px-3 flex-1 overflow-y-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center px-0' : 'px-4'} py-3 mb-1 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg shadow-slate-900/50'
                      : isDarkMode 
                        ? 'text-slate-400 hover:bg-slate-800/60 hover:text-white' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={sidebarCollapsed ? link.name : ''}
                >
                  <Icon className={`${sidebarCollapsed ? '' : 'mr-3'} text-lg ${
                    isActive 
                      ? 'text-white' 
                      : isDarkMode 
                        ? 'text-slate-500 group-hover:text-slate-300' 
                        : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  {!sidebarCollapsed && (
                    <span className="font-medium text-sm">{link.name}</span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className={`absolute left-full ml-2 px-3 py-2 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl border ${
                      isDarkMode 
                        ? 'bg-slate-800 text-white border-slate-700' 
                        : 'bg-gray-800 text-white border-gray-700'
                    }`}>
                      {link.name}
                      <div className={`absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent ${
                        isDarkMode ? 'border-r-slate-800' : 'border-r-gray-800'
                      }`}></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Admin Info */}
          <div className={`p-4 border-t transition-colors flex-shrink-0 ${
            isDarkMode 
              ? 'border-slate-800/50 bg-slate-900/95' 
              : 'border-gray-200 bg-white/95'
          }`}>
            {sidebarCollapsed ? (
              <>
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg shadow-slate-900/50 ring-2 ring-slate-600/50">
                    <Image 
                      src="/img.png" 
                      alt="Admin" 
                      width={40} 
                      height={40}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition duration-200 border border-red-500/20 group relative"
                  title="Logout"
                >
                  <FaSignOutAlt className="text-lg" />
                  <div className={`absolute left-full ml-2 px-3 py-2 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl border ${
                    isDarkMode 
                      ? 'bg-slate-800 text-white border-slate-700' 
                      : 'bg-gray-800 text-white border-gray-700'
                  }`}>
                    Logout
                    <div className={`absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent ${
                      isDarkMode ? 'border-r-slate-800' : 'border-r-gray-800'
                    }`}></div>
                  </div>
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg shadow-slate-900/50 ring-2 ring-slate-600/50">
                    <Image 
                      src="/img.png" 
                      alt="Admin" 
                      width={40} 
                      height={40}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Adeeb Jamil</p>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>Backend Developer</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition duration-200 border border-red-500/20"
                >
                  <FaSignOutAlt className="mr-2 text-sm" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            )}
          </div>
        </aside>

        {/* Main Content - Full height with scroll */}
        <div className={`h-screen overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
          {/* Top Header - Sticky */}
          <header className={`h-16 md:h-20 backdrop-blur-xl border-b sticky top-0 z-40 transition-colors ${
            isDarkMode 
              ? 'bg-slate-900/95 border-slate-800/50' 
              : 'bg-white/95 border-gray-200 shadow-sm'
          }`}>
            <div className="h-full flex items-center justify-between px-4 md:px-6">
              {/* Left Side - Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className={`lg:hidden p-2 rounded-lg transition ${
                  isDarkMode 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FaBars size={20} />
              </button>

              {/* Center - Date and Time */}
              <div className="flex-1 flex items-center justify-center lg:justify-start lg:ml-6">
                <div className="flex items-center space-x-4 md:space-x-6">
                  <div className={`hidden md:flex items-center space-x-3 px-4 py-2 rounded-xl border transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-800/40 border-slate-700/50' 
                      : 'bg-gray-100 border-gray-200'
                  }`}>
                    <FaClock className={isDarkMode ? 'text-slate-400' : 'text-gray-500'} />
                    <div>
                      <p className={`text-xs md:text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatDate(currentTime)}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>{formatTime(currentTime)}</p>
                    </div>
                  </div>
                  <div className={`md:hidden flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-800/40 border-slate-700/50' 
                      : 'bg-gray-100 border-gray-200'
                  }`}>
                    <FaClock className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatTime(currentTime)}</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Connection Status, Theme Toggle & Welcome Message */}
              <div className="flex items-center space-x-2 md:space-x-3">
                {/* Database Connection Indicator */}
                <div className={`hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-800/40 border-slate-700/50' 
                    : 'bg-gray-100 border-gray-200'
                }`} title="Database Connected">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>DB</span>
                </div>

                {/* Server Connection Indicator */}
                <div className={`hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-800/40 border-slate-700/50' 
                    : 'bg-gray-100 border-gray-200'
                }`} title="Server Connected">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Server</span>
                </div>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationOpen(!notificationOpen)}
                    className={`notification-button p-2 md:p-2.5 rounded-xl transition-all duration-300 border relative ${
                      isDarkMode 
                        ? 'bg-slate-800/60 hover:bg-slate-700/60 border-slate-700/50 text-slate-300 hover:text-slate-200' 
                        : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700 hover:text-gray-900'
                    } shadow-lg hover:scale-110 active:scale-95`}
                    title="Notifications"
                  >
                    <FaBell size={16} className="md:w-[18px] md:h-[18px]" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Panel */}
                  {notificationOpen && (
                    <div className={`notification-panel absolute right-0 mt-2 w-80 md:w-96 rounded-xl shadow-2xl border overflow-hidden z-50 transition-colors ${
                      isDarkMode 
                        ? 'bg-slate-900 border-slate-700' 
                        : 'bg-white border-gray-200'
                    }`}>
                      {/* Header */}
                      <div className={`px-4 py-3 border-b ${
                        isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Notifications
                            </h3>
                            {pendingEnquiries > 0 && (
                              <p className={`text-xs mt-1 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                {pendingEnquiries} pending enquir{pendingEnquiries > 1 ? 'ies' : 'y'}
                              </p>
                            )}
                          </div>
                          {unreadCount > 0 && (
                            <button
                              onClick={async () => {
                                try {
                                  const response = await fetch('/api/admin/notifications', {
                                    method: 'PUT',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ markAll: true }),
                                  });

                                  if (response.ok) {
                                    setNotifications(notifications.map(n => ({ ...n, read: true })));
                                    setUnreadCount(0);
                                    addNotification('success', '✅ All notifications marked as read');
                                  }
                                } catch (error) {
                                  console.error('Error marking as read:', error);
                                  addNotification('warning', '❌ Failed to mark notifications as read');
                                }
                              }}
                              className={`text-xs font-medium transition-colors ${
                                isDarkMode 
                                  ? 'text-slate-400 hover:text-slate-300' 
                                  : 'text-gray-600 hover:text-gray-700'
                              }`}
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center">
                            <FaBell className={`mx-auto mb-2 text-3xl ${
                              isDarkMode ? 'text-slate-600' : 'text-gray-300'
                            }`} />
                            <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                              No notifications yet
                            </p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 border-b transition-colors cursor-pointer ${
                                isDarkMode 
                                  ? 'border-slate-800 hover:bg-slate-800/50' 
                                  : 'border-gray-100 hover:bg-gray-50'
                              } ${!notification.read ? (isDarkMode ? 'bg-slate-800/30' : 'bg-gray-100/50') : ''}`}
                              onClick={() => {
                                if (notification.link) {
                                  router.push(notification.link);
                                  setNotificationOpen(false);
                                }
                                setNotifications(notifications.map(n => 
                                  n.id === notification.id ? { ...n, read: true } : n
                                ));
                                setUnreadCount(prev => Math.max(0, prev - 1));
                              }}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`text-2xl mt-0.5 flex-shrink-0`}>
                                  {notification.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-semibold mb-1 ${
                                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                                  }`}>
                                    {notification.title}
                                  </p>
                                  <p className={`text-sm mb-1 ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {notification.message}
                                  </p>
                                  <p className={`text-xs ${
                                    isDarkMode ? 'text-slate-500' : 'text-gray-500'
                                  }`}>
                                    {formatNotificationTime(new Date(notification.time))}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 animate-pulse ${isDarkMode ? 'bg-slate-500' : 'bg-gray-500'}`}></div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className={`px-4 py-3 border-t text-center ${
                          isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-center space-x-4">
                            <button
                              onClick={() => {
                                fetchNotifications();
                              }}
                              className={`text-xs font-medium transition-colors ${
                                isDarkMode 
                                  ? 'text-blue-400 hover:text-blue-300' 
                                  : 'text-blue-600 hover:text-blue-700'
                              }`}
                            >
                              🔄 Refresh
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  const response = await fetch('/api/admin/notifications', {
                                    method: 'DELETE',
                                  });

                                  if (response.ok) {
                                    setNotifications([]);
                                    setUnreadCount(0);
                                    setNotificationOpen(false);
                                    addNotification('success', '✅ All notifications cleared');
                                  }
                                } catch (error) {
                                  console.error('Error clearing notifications:', error);
                                  addNotification('warning', '❌ Failed to clear notifications');
                                }
                              }}
                              className={`text-xs font-medium transition-colors ${
                                isDarkMode 
                                  ? 'text-red-400 hover:text-red-300' 
                                  : 'text-red-600 hover:text-red-700'
                              }`}
                            >
                              🗑️ Clear all
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Theme Toggle Button */}
                <button
                  onClick={() => {
                    const newMode = !isDarkMode;
                    setIsDarkMode(newMode);
                    addNotification('info', newMode ? '🌙 Dark mode activated' : '☀️ Light mode activated');
                  }}
                  className={`p-2 md:p-2.5 rounded-xl transition-all duration-300 border ${
                    isDarkMode 
                      ? 'bg-slate-800/60 hover:bg-slate-700/60 border-slate-700/50 text-yellow-400 hover:text-yellow-300' 
                      : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700 hover:text-gray-900'
                  } shadow-lg hover:scale-110 active:scale-95`}
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? <FaSun size={16} className="md:w-[18px] md:h-[18px]" /> : <FaMoon size={16} className="md:w-[18px] md:h-[18px]" />}
                </button>

                {/* Welcome Message */}
                <div className="hidden lg:flex items-center space-x-3">
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome Back!</p>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>Adeeb Jamil</p>
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg shadow-slate-900/50 ring-2 ring-slate-600/50">
                    <Image 
                      src="/img.png" 
                      alt="Admin" 
                      width={40} 
                      height={40}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className={`p-4 md:p-6 lg:p-8 min-h-screen transition-colors ${
            isDarkMode ? 'bg-slate-950' : 'bg-gray-50'
          }`}>
            <div className={isDarkMode ? '' : 'light-mode'}>
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className={`fixed inset-0 z-40 lg:hidden backdrop-blur-sm transition-colors ${
              isDarkMode ? 'bg-slate-950/80' : 'bg-gray-900/50'
            }`}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </>
  );
}
