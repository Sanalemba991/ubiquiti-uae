'use client';

import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          {/* Company Column */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-3 text-sm">Company</h3>
            <ul className="space-y-2">
              {['Blog', 'Case Studies', 'Careers', 'Trust Center', 'Contact Us', 'Investors', 'Compliance'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-gray-900 text-xs transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Training Column */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-3 text-sm">Training</h3>
            <ul className="space-y-2">
              {['Courses', 'Calendar', 'Trainers', 'Become a Trainer'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-gray-900 text-xs transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Buy Now Column */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-3 text-sm">Buy Now</h3>
            <ul className="space-y-2">
              {['Ubiquiti Store', 'Find a Distributor', 'Become a Distributor'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-gray-900 text-xs transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Column */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-3 text-sm">Tools</h3>
            <ul className="space-y-2">
              {['WiFiman', 'UISP', 'UniFi Design Center', 'UISP Design Center', 'Downloads'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-gray-900 text-xs transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay in Touch Column */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-3 text-sm">Stay in Touch</h3>
            <div className="space-y-3">
              {/* Email Subscribe */}
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-medium transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-2 pt-1">
                {[Facebook, Twitter, Youtube, Instagram].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    <Icon className="w-3 h-3 text-gray-700" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-6">
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600 mb-3">
            {['Terms of Service', 'Privacy Policy', 'Legal', 'Cookies Settings'].map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <a href="#" className="hover:text-gray-900 transition-colors">
                  {item}
                </a>
                {index < 3 && <span className="text-gray-400">|</span>}
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-gray-600">
            © 2025 Ubiquiti, Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}