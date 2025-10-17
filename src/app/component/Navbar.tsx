'use client';
import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, MapPin, Mail, Phone } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function UniFiNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shouldShowWhiteBg = isScrolled || isHovered || isMobileMenuOpen;

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  const handleActionClick = (type: string) => {
    switch (type) {
      case 'location':
        window.open('https://maps.google.com', '_blank');
        break;
      case 'email':
        window.location.href = 'mailto:info@unifi.com';
        break;
      case 'call':
        window.location.href = 'tel:+96050 966 4956';
        break;
      default:
        break;
    }
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Products', href: '/products' },
    { label: 'Solutions', href: '/solution' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const actionItems = [
    { icon: MapPin, label: 'Location', type: 'location' },
    { icon: Mail, label: 'Email', type: 'email' },
    { icon: Phone, label: 'Call', type: 'call' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${shouldShowWhiteBg ? 'bg-white shadow-md' : 'bg-transparent'
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo and Nav Items */}
            <div className="flex items-center space-x-10">
              {/* Logo */}
              <div className="flex items-center">
                <button
                  onClick={() => handleNavigation('/')}
                  className={`text-2xl font-bold transition-colors cursor-pointer ${shouldShowWhiteBg ? 'text-gray-900' : 'text-white'
                    }`}
                >
                 Ubiquiti
                </button>
              </div>
              {/* Desktop Navigation Items */}
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                  <div key={item.label} className="relative group">
                    <button
                      onClick={() => handleNavigation(item.href)}
                      className={`text-sm font-medium transition-colors cursor-pointer rounded-lg px-4 py-2 mx-1 ${shouldShowWhiteBg
                        ? isActivePath(item.href)
                          ? 'bg-gray-100 text-gray-600'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        : isActivePath(item.href)
                          ? 'bg-gray-200/20 text-white'
                          : 'text-white hover:text-gray-200 hover:bg-white/10'
                        }`}
                    >
                      {item.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Right Section - Action Icons */}
            <div className="flex items-center space-x-6">
              {/* Action Icons */}
              <div className="hidden md:flex items-center space-x-5">
                {actionItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleActionClick(item.type)}
                      className={`p-2 transition-all duration-200 cursor-pointer rounded-lg ${shouldShowWhiteBg
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        : 'text-white hover:text-gray-200 hover:bg-white/10'
                        }`}
                      title={item.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
              {/* Mobile Menu Button */}
              <button
                className={`md:hidden p-2 transition-colors rounded-lg cursor-pointer ${shouldShowWhiteBg
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
                  }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          <div
            className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            <div className="py-4 border-t border-gray-200">
              {navItems.map((item) => (
                <div key={item.label} className="border-b border-gray-100 last:border-b-0">
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleNavigation(item.href)}
                      className={`block w-full text-left py-3 font-medium transition-colors cursor-pointer rounded-lg mx-2 my-1 px-3 ${isActivePath(item.href)
                        ? 'bg-gray-50 text-gray-600 border border-gray-200'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                      {item.label}
                    </button>
                  </div>
                </div>
              ))}
              {/* Mobile Action Items */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 py-3">
                  {actionItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => handleActionClick(item.type)}
                        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <IconComponent className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}