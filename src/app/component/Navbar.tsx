'use client';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Menu, X, MapPin, Mail, Phone, ChevronRight } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  category: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  navbarCategory?: any;
  subCategories?: SubCategory[];
}

interface NavbarCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  categories?: any[];
}

interface NavLink {
  label: string;
  slug: string;
  href: string;
}

export default function UniFiNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [navLinks, setNavLinks] = useState<NavLink[]>([
    { label: 'About', slug: 'about', href: '/about' },
    { label: 'Solutions', slug: 'solutions', href: '/solution' },
    { label: 'Contact Us', slug: 'contact', href: '/contact' },
  ]);
  
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingCategories(true);

        const [navbarRes, categoriesRes, subCategoriesRes] = await Promise.all([
          fetch('/api/navbar-category'),
          fetch('/api/category'),
          fetch('/api/subcategory')
        ]);

        const navbarResult = await navbarRes.json().catch(() => ({ success: false, data: [] }));
        const categoriesResult = await categoriesRes.json().catch(() => ({ success: false, data: [] }));
        const subCategoriesResult = await subCategoriesRes.json().catch(() => ({ success: false, data: [] }));

        const navbarCats = navbarResult.success && navbarResult.data ? navbarResult.data : [];
        setNavbarCategories(navbarCats);

        if (categoriesResult.success && categoriesResult.data) {
          const cats: Category[] = categoriesResult.data;
          const subCats: SubCategory[] = subCategoriesResult.success && subCategoriesResult.data ? subCategoriesResult.data : [];

          const catsWithSub = cats.map((cat) => ({
            ...cat,
            subCategories: subCats.filter((sub) =>
              (typeof sub.category === 'object' && sub.category !== null && (sub.category as any)._id === cat._id) || sub.category === cat._id || sub.category === cat.slug
            )
          }));

          setCategories(catsWithSub);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching navbar/categories:', error);
        setCategories([]);
        setNavbarCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const shouldShowWhiteBg = isScrolled || isHovered || isMobileMenuOpen;
  const isAnyDropdownOpen = openDropdown !== null;

  const findNavbarSlugForCategory = (cat: Category): string | null => {
    if ((cat as any).navbarCategory) {
      const nc = (cat as any).navbarCategory;
      if (typeof nc === 'string') {
        const found = navbarCategories.find((n) => (n._id === nc || n._id === (nc as any)?._id));
        return found ? found.slug : null;
      } else if (typeof nc === 'object' && nc.slug) {
        return nc.slug;
      }
    }

    const foundNav = navbarCategories.find((nav) => {
      if (!nav.categories) return false;
      return nav.categories.some((c: any) =>
        c === cat._id || c === cat.slug || (c && (c._id === cat._id || c.slug === cat.slug))
      );
    });
    if (foundNav) return foundNav.slug;

    return null;
  };

  const buildCategoryHref = (cat: Category) => {
    const parent = findNavbarSlugForCategory(cat);
    return parent ? `/${parent}/${cat.slug}` : `/${cat.slug}`;
  };

  const buildSubCategoryHref = (cat: Category, sub: SubCategory) => {
    const parent = findNavbarSlugForCategory(cat);
    return parent ? `/${parent}/${cat.slug}/${sub.slug}` : `/${cat.slug}/${sub.slug}`;
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleActionClick = (type: string) => {
    switch (type) {
      case 'location':
        window.open('https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d185.85699190367959!2d55.30896546588453!3d25.27341693672885!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d48ffab5a65%3A0x8c2898929d4589f7!2sLovosis%20Technology%20L.L.C!5e1!3m2!1sen!2sin!4v1764833527855!5m2!1sen!2sin', '_blank');
        break;
      case 'email':
        window.location.href = 'mailto:sales@ubiquiti-uae.com';
        break;
      case 'call':
        window.location.href = 'tel:+9710509664956';
        break;
      default:
        break;
    }
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const isCategoryActive = (catSlug: string) => {
    if (pathname.startsWith(`/${catSlug}`)) return true;
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[1] === catSlug) return true;
    return false;
  };

  const handleMouseEnter = (categoryId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setOpenDropdown(categoryId);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 500);
  };

  const actionItems = [
    { icon: MapPin, label: 'Location', type: 'location', description: 'Find us' },
    { icon: Mail, label: 'Email', type: 'email', description: 'sales@ubiquiti-uae.com' },
    { icon: Phone, label: 'Call', type: 'call', description: '+971 050 966 4956' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          shouldShowWhiteBg ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="max-w-full mx-auto px-4 2xl:px-8">
          {/* Desktop Navbar */}
          <div className="hidden lg:flex items-center justify-between h-14">
            {/* Left Section - Logo and Nav Items */}
            <div className="flex items-center gap-4 2xl:gap-6 flex-1 min-w-0">
              <button
                onClick={() => handleNavigation('/')}
                className={`text-xl font-bold transition-colors cursor-pointer flex-shrink-0 ${
                  shouldShowWhiteBg ? 'text-gray-900' : 'text-white'
                }`}
              >
                <Image src="/logoua.png" alt="Ubiquiti UAE" width={120} height={40} />
              </button>
              
              <div className="flex items-center gap-0.5 2xl:gap-1 flex-wrap">
                <button
                  onClick={() => handleNavigation('/')}
                  className={`text-xs lg:text-sm font-medium transition-colors cursor-pointer rounded-lg px-2 lg:px-3 2xl:px-4 py-2 whitespace-nowrap
                    ${
                      shouldShowWhiteBg
                        ? isActivePath('/')
                          ? 'bg-gray-100 text-blue-600'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                        : isActivePath('/')
                          ? 'bg-gray-200/20 text-blue-400'
                          : 'text-white hover:text-blue-400 hover:bg-white/10'
                    }`}
                >
                  Home
                </button>

                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="relative group"
                    onMouseEnter={() => handleMouseEnter(cat._id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => handleNavigation(buildCategoryHref(cat))}
                      className={`text-xs lg:text-sm font-medium transition-colors cursor-pointer rounded-lg px-2 lg:px-3 2xl:px-4 py-2 flex items-center gap-1 whitespace-nowrap
                        ${
                          shouldShowWhiteBg
                            ? (isCategoryActive(cat.slug) || openDropdown === cat._id)
                              ? 'bg-gray-100 text-blue-600'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                            : (isCategoryActive(cat.slug) || openDropdown === cat._id)
                              ? 'bg-gray-200/20 text-blue-400'
                              : 'text-white hover:text-blue-400 hover:bg-white/10'
                        }`}
                    >
                      <span>{cat.name}</span>
                    </button>

                    {cat.subCategories && cat.subCategories.length > 0 && openDropdown === cat._id && (
                      <div
                        className="fixed left-0 right-0 top-14 z-50 bg-white shadow-xl transition-opacity duration-300"
                        onMouseEnter={() => handleMouseEnter(cat._id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="max-w-full mx-auto px-6 2xl:px-8 py-2">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6 2xl:gap-8">
                            {cat.subCategories.map((subCat) => (
                              <button
                                key={subCat._id}
                                onClick={() => handleNavigation(buildSubCategoryHref(cat, subCat))}
                                className="flex flex-col items-center text-center p-3 sm:p-4 2xl:p-5 bg-white rounded-lg hover:shadow-md transition-all duration-150 cursor-pointer group/subcategory"
                              >
                                <div className="bg-transparent overflow-hidden flex items-center justify-center h-16 sm:h-20 md:h-24 lg:h-28 xl:h-28 2xl:h-32 w-full">
                                  {subCat.image ? (
                                    <img
                                      src={subCat.image}
                                      alt={subCat.name}
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <div className="text-gray-400 text-xs">No Image</div>
                                  )}
                                </div>

                                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover/subcategory:text-blue-600 transition-colors mt-2 line-clamp-2">
                                  {subCat.name}
                                </h4>

                                {subCat.description && (
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 sm:line-clamp-3 hidden sm:block">
                                    {subCat.description}
                                  </p>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {navLinks.map((link) => (
                  <button
                    key={link.slug}
                    onClick={() => handleNavigation(link.href)}
                    className={`text-xs lg:text-sm font-medium transition-colors cursor-pointer rounded-lg px-2 lg:px-3 2xl:px-4 py-2 whitespace-nowrap
                      ${
                        shouldShowWhiteBg
                          ? isActivePath(link.href)
                            ? 'bg-gray-100 text-blue-600'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                          : isActivePath(link.href)
                            ? 'bg-gray-200/20 text-blue-400'
                            : 'text-white hover:text-blue-400 hover:bg-white/10'
                      }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Right Section - Action Icons */}
            <div className={`flex items-center gap-3 2xl:gap-4 transition-all duration-200 flex-shrink-0 ${
              isAnyDropdownOpen || isMobileMenuOpen
                ? 'opacity-0 invisible scale-95' 
                : 'opacity-100 visible scale-100'
            }`}>
              {actionItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleActionClick(item.type)}
                    className={`p-2 transition-all duration-200 cursor-pointer rounded-lg ${
                      shouldShowWhiteBg
                        ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        : 'text-white hover:text-blue-400 hover:bg-blue-500/10'
                    }`}
                    title={item.label}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile & Tablet Header */}
          <div className="lg:hidden flex items-center justify-between h-14">
            <button
              onClick={() => handleNavigation('/')}
              className={`text-lg font-bold transition-colors cursor-pointer ${
                shouldShowWhiteBg ? 'text-gray-900' : 'text-white'
              }`}
            >
              <Image src="/logoua.png" alt="Ubiquiti UAE" width={120} height={40} />
            </button>

            <button
              className={`p-2 transition-colors rounded-lg cursor-pointer ${
                shouldShowWhiteBg
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile & Tablet Menu - Ultra Professional Design */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-gradient-to-b from-white to-gray-50/50 border-t border-gray-200 shadow-2xl">
            <div 
              ref={mobileMenuRef}
              className="max-h-[calc(100vh-56px)] overflow-y-auto"
              style={{ 
                scrollbarWidth: 'thin', 
                scrollbarColor: '#CBD5E1 #F1F5F9',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="px-4 py-2">
                {/* Home */}
                <button
                  onClick={() => handleNavigation('/')}
                  className={`w-full flex items-center justify-between px-4 py-3.5 font-medium text-sm rounded-xl mb-1 transition-all duration-200 ${
                    isActivePath('/')
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-900 hover:bg-white active:bg-gray-100'
                  }`}
                >
                  <span>Home</span>
                  {isActivePath('/') && <ChevronRight className="w-4 h-4" />}
                </button>

                {/* Categories */}
                {categories.map((cat) => (
                  <div key={cat._id} className="mb-1">
                    <button
                      onClick={() => {
                        if (cat.subCategories && cat.subCategories.length > 0) {
                          setOpenDropdown(openDropdown === cat._id ? null : cat._id);
                        } else {
                          handleNavigation(buildCategoryHref(cat));
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 font-medium text-sm rounded-xl transition-all duration-200 ${
                        isCategoryActive(cat.slug)
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                          : openDropdown === cat._id
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-900 hover:bg-white active:bg-gray-100'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <div className="flex items-center gap-2">
                        {isCategoryActive(cat.slug) && !cat.subCategories?.length && (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        {cat.subCategories && cat.subCategories.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs opacity-75">
                              {cat.subCategories.length}
                            </span>
                            <ChevronDown 
                              className={`w-4 h-4 transition-transform duration-300 ${
                                openDropdown === cat._id ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Mobile Subcategories - Premium Card Grid */}
                    {cat.subCategories && cat.subCategories.length > 0 && openDropdown === cat._id && (
                      <div className="mt-2 mb-3 px-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 overflow-hidden">
                          <div className="flex flex-col gap-1">
                            {cat.subCategories.map((subCat) => (
                              <button
                                key={subCat._id}
                                onClick={() => handleNavigation(buildSubCategoryHref(cat, subCat))}
                                className="w-full flex items-center justify-between px-4 py-3.5 text-sm rounded-xl transition-all duration-200 text-gray-900 hover:bg-white active:bg-gray-100"
                              >
                                <span className="text-left">{subCat.name}</span>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Nav Links */}
                {navLinks.map((link) => (
                  <button
                    key={link.slug}
                    onClick={() => handleNavigation(link.href)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 font-medium text-sm rounded-xl mb-1 transition-all duration-200 ${
                      isActivePath(link.href)
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-900 hover:bg-white active:bg-gray-100'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActivePath(link.href) && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>

              {/* Mobile Action Items - Premium Contact Section */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50/40 to-purple-50/30 px-4 py-6 mt-4 border-t border-gray-200">
                <div className="mb-4">
                  <h3 className="text-base font-medium text-gray-900 mb-1">Get in Touch</h3>
                  <p className="text-xs text-gray-600">We're here to help you anytime</p>
                </div>
                
                <div className="space-y-2.5">
                  {actionItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => handleActionClick(item.type)}
                        className="group w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl active:scale-[0.98] transition-all duration-200"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-200">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-gray-900 mb-0.5">{item.label}</div>
                          <div className="text-xs text-gray-600">{item.description}</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 top-14 transition-opacity duration-300"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setOpenDropdown(null);
          }}
        />
      )}

      {/* Responsive Typography Styles */}
      <style jsx global>{`
        @media (max-width: 1024px) and (max-height: 1366px) {
          nav button span,
          nav button {
            font-size: 0.65rem !important;
          }
          
          nav .text-xs {
            font-size: 0.60rem;
          }
          
          nav .text-sm {
            font-size: 0.65rem;
          }
        }
        
        /* Smooth scrolling for mobile menu */
        @media (max-width: 1024px) {
          .overflow-y-auto {
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </>
  );
}