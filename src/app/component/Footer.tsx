// components/Footer.tsx
'use client';

import { useEffect, useState } from 'react';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="w-full bg-neutral-300 dark:bg-neutral-900">
      <div className="mx-auto w-full max-w-[85rem] px-4 py-8 sm:px-6 lg:px-16 lg:pt-20 2xl:max-w-screen-2xl">
        <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-4 md:text-left lg:grid-cols-7">
          {/* Brand Section */}
          <div className="col-span-full lg:col-span-2">
            <a href="/" aria-label="Brand">
              <img
                src="/pictures/logo.png"
                alt="Uquibity UAE Logo"
                className="w-38 mx-auto h-12 md:mx-0"
              />
            </a>
            <h3 className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Uquibity UAE specializes in custom fabrication and surveillance solutions in Dubai. 
              We are committed to delivering top-quality services tailored to meet your needs.
            </h3>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-bold text-neutral-800 dark:text-neutral-200">
              Quick Link
            </h3>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
              <a href="/" className="hover:text-blue-600">Home</a>
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              <a href="/about" className="hover:text-blue-600">About</a>
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              <a href="/contact" className="hover:text-blue-600">Contact</a>
            </p>
          </div>

          {/* Solutions */}
          <div className="col-span-1">
            <h3 className="font-bold text-neutral-800 dark:text-neutral-200">
              Solution
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              <a href="/solution/cloud-gateways" className="hover:text-blue-600">Cloud Gateways</a>
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              <a href="/solution/switching" className="hover:text-blue-600">Switching</a>
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              <a href="/solution/wifi" className="hover:text-blue-600">WiFi</a>
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              <a href="/solution/physical-security" className="hover:text-blue-600">Physical Security</a>
            </p>
             <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              <a href="/solution/integrations" className="hover:text-blue-600">Integration</a>
            </p>
            
          </div>

          {/* Brands */}
          <div className="col-span-1">
            <h3 className="font-bold text-neutral-800 dark:text-neutral-200">Products</h3>
           
          </div>

          {/* Contact Information */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-bold text-neutral-800 dark:text-neutral-200">
              Stay up to date
            </h3>
            
            {/* Address */}
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
              <a
                href="https://www.google.com/maps/place/Digital+Link+Technology+LLC+-+UNV+National+Distributor+in+Dubai,+UAE/@25.2735063,55.3066148,683m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3e5f432649d77a05:0x329bece680652a9d!8m2!3d25.2735015!4d55.3091897!16s%2Fg%2F11k53tb1x1?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center hover:text-blue-600"
              >
                <LocationIcon />
                <span className="ml-1">
                  Baghlaf Building Showroom No.5 Satellite Market Naif Deira - Dubai
                  United Arab Emirates
                </span>
              </a>
            </p>

            {/* Phone Numbers */}
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
              <a
                href="https://wa.me/+971552929644"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center hover:text-blue-600"
              >
                <WhatsAppIcon />
                <span className="ml-2">+971 55 2929644</span>
              </a>
              <a
                href="https://wa.me/+971509162488"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center hover:text-blue-600 ml-4"
              >
                <PhoneIcon />
                <span className="ml-2">+971 50 916 2488</span>
              </a>
            </p>

            {/* Email */}
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
              <a
                href="mailto:sales@uquibity-uae.com"
                className="inline-flex items-center hover:text-blue-600"
              >
                <EmailIcon />
                <span className="ml-2">sales@uquibity-uae.com</span>
              </a>
            </p>
          </div>
        </div>

        <hr className="mt-6 border-t border-neutral-400 dark:border-neutral-700" />
        
        {/* Footer Bottom */}
        <div className="mt-2 grid gap-y-2 text-center sm:flex sm:items-center sm:justify-between sm:gap-y-0 sm:text-left">
          <div className="flex w-full flex-col items-center sm:flex-row sm:justify-between">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              © {currentYear} Uquibity UAE. All rights reserved
              <a
                className="rounded-lg font-medium underline underline-offset-2 outline-none ring-zinc-500 transition duration-300 hover:text-neutral-700 hover:decoration-dashed focus:outline-none focus-visible:ring dark:ring-zinc-200 dark:hover:text-neutral-300"
                href="https://uquibity-uae.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                .
              </a>
            </p>
            
            {/* Social Media */}
            <div className="mt-4 flex space-x-4 sm:mt-0">
              <a
                href="https://www.instagram.com/uquibity_uae"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Icon Components
const LocationIcon = () => (
  <svg
    className="h-6 w-6 flex-shrink-0 text-neutral-600 dark:text-neutral-400"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
    <path
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
    ></path>
  </svg>
);

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 flex-shrink-0 text-neutral-600 dark:text-neutral-400"
    viewBox="0 0 256 256"
  >
    <path
      fill="currentColor"
      d="m187.58 144.84l-32-16a8 8 0 0 0-8 .5l-14.69 9.8a40.55 40.55 0 0 1-16-16l9.8-14.69a8 8 0 0 0 .5-8l-16-32A8 8 0 0 0 104 64a40 40 0 0 0-40 40a88.1 88.1 0 0 0 88 88a40 40 0 0 0 40-40a8 8 0 0 0-4.42-7.16M152 176a72.08 72.08 0 0 1-72-72a24 24 0 0 1 19.29-23.54l11.48 23L101 118a8 8 0 0 0-.73 7.51a56.47 56.47 0 0 0 30.15 30.15A8 8 0 0 0 138 155l14.61-9.74l23 11.48A24 24 0 0 1 152 176M128 24a104 104 0 0 0-91.82 152.88l-11.35 34.05a16 16 0 0 0 20.24 20.24l34.05-11.35A104 104 0 1 0 128 24m0 192a87.87 87.87 0 0 1-44.06-11.81a8 8 0 0 0-6.54-.67L40 216l12.47-37.4a8 8 0 0 0-.66-6.54A88 88 0 1 1 128 216"
    ></path>
  </svg>
);

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 flex-shrink-0 text-neutral-600 dark:text-neutral-400"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M11.25 2.75v18.5a.75.75 0 0 0 1.5 0V2.75a.75.75 0 0 0-1.5 0"
    ></path>
  </svg>
);

const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 flex-shrink-0 text-neutral-600 dark:text-neutral-400"
    viewBox="0 0 24 24"
  >
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="M21 12a9 9 0 1 0-6.67 8.693"></path>
      <circle cx="12" cy="12" r="4"></circle>
      <path
        strokeLinecap="round"
        d="M16 9v4.5a2.5 2.5 0 0 0 2.5 2.5v0a2.5 2.5 0 0 0 2.5-2.5V12"
      ></path>
    </g>
  </svg>
);

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="mt-2 h-5 w-5 flex-shrink-0 text-neutral-600 dark:text-neutral-400"
    viewBox="0 0 16 16"
  >
    <path
      fill="currentColor"
      d="M8 0C5.829 0 5.556.01 4.703.048C3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7C.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297c.04.852.174 1.433.372 1.942c.205.526.478.972.923 1.417c.444.445.89.719 1.416.923c.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417c.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046c.78.035 1.204.166 1.486.275c.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485c.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598c-.28.11-.704.24-1.485.276c-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598a2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485c-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486c.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276c.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92a.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217a4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334a2.667 2.667 0 0 1 0-5.334"
    ></path>
  </svg>
);

export default Footer;