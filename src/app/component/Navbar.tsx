'use client';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Menu, X, MapPin, Mail, Phone } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

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

  // Close mobile menu when clicking outside
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

  // Prevent body scroll when mobile menu is open
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
        window.open('https://maps.google.com', '_blank');
        break;
      case 'email':
        window.location.href = 'mailto:info@unifi.com';
        break;
      case 'call':
        window.location.href = 'tel:+96050 966 4956';
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

  // Enhanced hover handlers with delay for smoother unhover
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
    { icon: MapPin, label: 'Location', type: 'location' },
    { icon: Mail, label: 'Email', type: 'email' },
    { icon: Phone, label: 'Call', type: 'call' },
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left Section - Logo and Nav Items */}
            <div className="flex items-center space-x-10">
              {/* Logo */}
              <div className="flex items-center">
                <button
                  onClick={() => handleNavigation('/')}
                  className={`text-xl font-bold transition-colors cursor-pointer ${
                    shouldShowWhiteBg ? 'text-gray-900' : 'text-white'
                  }`}
                >
                  Ubiquiti
                </button>
              </div>
              
              {/* Desktop Navigation Items - Hidden on iPad and smaller */}
              <div className="hidden xl:flex items-center space-x-1">
                {/* Home Link */}
                <button
                  onClick={() => handleNavigation('/')}
                  className={`text-xs font-medium transition-colors cursor-pointer rounded-lg px-3 py-2 mx-0.5 ${
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

                {/* Categories with Dropdowns - Navigate on click */}
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="relative group"
                    onMouseEnter={() => handleMouseEnter(cat._id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => handleNavigation(buildCategoryHref(cat))}
                      className={`text-xs font-medium transition-colors cursor-pointer rounded-lg px-3 py-2 mx-0.5 flex items-center space-x-1 ${
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

                    {/* Dropdown Menu - Hover only */}
                    {cat.subCategories && cat.subCategories.length > 0 && openDropdown === cat._id && (
                      <div
                        className="fixed left-0 right-0 top-14 z-50 bg-white shadow-xl transition-opacity duration-300"
                        onMouseEnter={() => handleMouseEnter(cat._id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="w-full">
                          <div className="max-w-7xl mx-auto px-6 py-2">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                              {cat.subCategories.map((subCat) => (
                                <button
                                  key={subCat._id}
                                  onClick={() => handleNavigation(buildSubCategoryHref(cat, subCat))}
                                  className="flex flex-col items-center text-center p-4 bg-white rounded-lg hover:shadow-md transition-all duration-150 cursor-pointer group/subcategory"
                                >
                                  <div className="bg-transparent overflow-hidden flex items-center justify-center">
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

                                  <h4 className="text-sm font-semibold text-gray-900 group-hover/subcategory:text-blue-600 transition-colors">
                                    {subCat.name}
                                  </h4>

                                  {subCat.description && (
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-3">
                                      {subCat.description}
                                    </p>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Nav Links - About, Solutions, Contact Us - Smaller */}
                {navLinks.map((link) => (
                  <button
                    key={link.slug}
                    onClick={() => handleNavigation(link.href)}
                    className={`text-xs font-medium transition-colors cursor-pointer rounded-lg px-3 py-2 mx-0.5 ${
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
            <div className="flex items-center space-x-6">
              {/* Action Icons - Hidden on iPad (764px to 1024px) and when dropdown is open OR mobile menu is open */}
              <div className={`hidden xl:flex items-center space-x-5 transition-all duration-200 ${
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
              
              {/* Mobile Menu Button - Always visible on iPad and smaller, shows only toggle when menu is open */}
              <button
                className={`xl:hidden p-2 transition-colors rounded-lg cursor-pointer ${
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
          
          {/* Enhanced Mobile & iPad Menu */}
          <div
            ref={mobileMenuRef}
            className={`xl:hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen 
                ? 'max-h-[80vh] opacity-100 visible' 
                : 'max-h-0 opacity-0 invisible'
            }`}
          >
            <div className="py-4 border-t border-gray-200 bg-white">
              {/* Scrollable Container - Vertical scrolling only, horizontal disabled */}
              <div 
                className="max-h-[60vh] overflow-y-auto overflow-x-hidden overscroll-contain"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#9CA3AF #F3F4F6' }}
              >
                
                {/* Home */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => handleNavigation('/')}
                    className={`block w-full text-left py-3 font-medium transition-colors cursor-pointer rounded-lg mx-2 my-1 px-3 ${
                      isActivePath('/')
                        ? 'bg-gray-50 text-blue-600 border border-blue-200'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    Home
                  </button>
                </div>

                {/* Categories with Enhanced Dropdown */}
                {categories.map((cat) => (
                  <div key={cat._id} className="border-b border-gray-100 last:border-b-0">
                    <div className="flex flex-col">
                      <button
                        onClick={() => {
                          if (cat.subCategories && cat.subCategories.length > 0) {
                            setOpenDropdown(openDropdown === cat._id ? null : cat._id);
                          } else {
                            handleNavigation(buildCategoryHref(cat));
                          }
                        }}
                        className={`flex items-center justify-between w-full text-left py-3 font-medium transition-colors cursor-pointer rounded-lg mx-2 my-1 px-3 ${
                          isCategoryActive(cat.slug) || openDropdown === cat._id
                            ? 'bg-gray-50 text-blue-600 border border-blue-200'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-sm font-semibold">{cat.name}</span>
                        {cat.subCategories && cat.subCategories.length > 0 && (
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform duration-200 ${
                              openDropdown === cat._id ? 'rotate-180' : ''
                            }`} 
                          />
                        )}
                      </button>

                      {/* Enhanced Mobile Dropdown - Vertical scrolling only */}
                      {cat.subCategories && cat.subCategories.length > 0 && openDropdown === cat._id && (
                        <div className="ml-4 mr-2 mb-2 mt-1 bg-gray-50 rounded-lg border border-gray-200">
                          <div 
                            className="max-h-48 overflow-y-auto overflow-x-hidden py-2"
                            style={{ scrollbarWidth: 'thin', scrollbarColor: '#9CA3AF #F3F4F6' }}
                          >
                            {cat.subCategories.map((subCat) => (
                              <button
                                key={subCat._id}
                                onClick={() => handleNavigation(buildSubCategoryHref(cat, subCat))}
                                className="block w-full text-left py-2.5 px-4 text-gray-700 hover:text-blue-600 hover:bg-white transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm text-gray-900 mb-1">
                                    {subCat.name}
                                  </span>
                                  {subCat.description && (
                                    <span className="text-xs text-gray-500 line-clamp-2 text-left">
                                      {subCat.description}
                                    </span>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Mobile & iPad Nav Links */}
                {navLinks.map((link) => (
                  <div key={link.slug} className="border-b border-gray-100">
                    <button
                      onClick={() => handleNavigation(link.href)}
                      className={`block w-full text-left py-3 font-medium transition-colors cursor-pointer rounded-lg mx-2 my-1 px-3 ${
                        isActivePath(link.href)
                          ? 'bg-gray-50 text-blue-600 border border-blue-200'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                      }`}
                    >
                      {link.label}
                    </button>
                  </div>
                ))}
              </div>

              {/* Mobile & iPad Action Items - Fixed at bottom */}
              <div className="pt-4 border-t border-gray-200 bg-white">
                <div className="flex items-center justify-around py-3 px-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg mx-2">
                  {actionItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => handleActionClick(item.type)}
                        className="flex flex-col items-center p-3 text-gray-700 hover:text-blue-600 transition-colors hover:bg-white rounded-lg cursor-pointer flex-1 mx-1"
                      >
                        <IconComponent className="w-5 h-5 mb-1" />
                        <span className="text-xs font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="xl:hidden fixed inset-0 bg-black bg-opacity-50 z-40 top-14"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setOpenDropdown(null);
          }}
        />
      )}
    </>
  );
}