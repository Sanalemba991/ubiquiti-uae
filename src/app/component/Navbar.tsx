'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Globe, Settings } from 'lucide-react';

export default function UniFiNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shouldShowWhiteBg = isScrolled || isHovered;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          shouldShowWhiteBg ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo and Nav Items */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">UniFi</span>
              </div>

              {/* Navigation Items */}
              <div className="hidden md:flex items-center space-x-6">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                  <span>Start Here</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                  Cloud Gateways
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                  Switching
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                  WiFi
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                  Physical Security
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                  Integrations
                </a>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                What's New
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                Support
              </a>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">
                Store
              </button>
              <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <Globe className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Content */}
      
    </>
  );
}